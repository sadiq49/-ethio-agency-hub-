import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Avatar, ActivityIndicator, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { formatDistanceToNow } from 'date-fns';

export default function ConversationScreen({ route, navigation }) {
  const { conversationId, recipientId, recipientName, isGroup } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const { user } = useAuth();
  const typingTimeoutRef = useRef(null);
  const messageSubscriptionRef = useRef(null);
  const typingSubscriptionRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    setupMessageSubscription();
    setupTypingIndicator();
    
    if (isGroup) {
      fetchGroupParticipants();
    }
    
    return () => {
      // Clean up subscriptions
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current.unsubscribe();
      }
      if (typingSubscriptionRef.current) {
        typingSubscriptionRef.current.unsubscribe();
      }
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, name, avatar_url),
          attachments(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages(data || []);
      
      // Mark messages as read
      await markMessagesAsRead();
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          user:user_id(id, name, avatar_url)
        `)
        .eq('conversation_id', conversationId);
      
      if (error) throw error;
      setParticipants(data?.map(p => p.user) || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const setupMessageSubscription = () => {
    messageSubscriptionRef.current = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        // Fetch the complete message with sender and attachments
        fetchNewMessage(payload.new.id);
      })
      .subscribe();
  };

  const fetchNewMessage = async (messageId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, name, avatar_url),
          attachments(*)
        `)
        .eq('id', messageId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setMessages(prevMessages => [...prevMessages, data]);
        
        // Mark as read if from another user
        if (data.sender_id !== user.id) {
          markMessageAsRead(data.id);
        }
        
        // Scroll to bottom
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }
    } catch (error) {
      console.error('Error fetching new message:', error);
    }
  };

  const setupTypingIndicator = () => {
    // Set up subscription for typing indicators
    typingSubscriptionRef.current = supabase
      .channel('typing')
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.conversation_id === conversationId && 
            payload.payload.user_id !== user.id) {
          setIsTyping(true);
          
          // Clear typing indicator after 3 seconds
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      })
      .subscribe();
  };

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && attachments.length === 0) || isSending) return;
    
    setIsSending(true);
    try {
      // Insert message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: messageText.trim(),
          read: false
        })
        .select()
        .single();
      
      if (messageError) throw messageError;
      
      // Upload attachments if any
      if (attachments.length > 0) {
        for (const attachment of attachments) {
          // Upload file to storage
          const fileExt = attachment.uri.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `message_attachments/${messageData.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, attachment.file);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: urlData } = await supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);
          
          // Insert attachment record
          await supabase
            .from('attachments')
            .insert({
              message_id: messageData.id,
              file_path: filePath,
              file_url: urlData.publicUrl,
              file_type: attachment.type,
              file_name: attachment.name || fileName
            });
        }
      }
      
      // Clear input and attachments
      setMessageText('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (text) => {
    setMessageText(text);
    
    // Broadcast typing indicator
    supabase
      .channel('typing')
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          conversation_id: conversationId,
          user_id: user.id
        }
      });
  };

  const handleImageAttachment = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Convert URI to blob
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        
        setAttachments([...attachments, {
          uri: asset.uri,
          type: 'image',
          name: `image_${Date.now()}.jpg`,
          file: blob
        }]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleDocumentAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });
      
      if (result.type === 'success') {
        // Convert URI to blob
        const response = await fetch(result.uri);
        const blob = await response.blob();
        
        setAttachments([...attachments, {
          uri: result.uri,
          type: 'document',
          name: result.name,
          file: blob
        }]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sender_id === user.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        {!isOwnMessage && !isGroup && (
          <Avatar.Image 
            size={36} 
            source={{ uri: item.sender?.avatar_url }} 
            style={styles.avatar}
          />
        )}
        
        {!isOwnMessage && isGroup && (
          <View style={styles.groupMessageHeader}>
            <Avatar.Image 
              size={36} 
              source={{ uri: item.sender?.avatar_url }} 
              style={styles.avatar}
            />
            <Text style={styles.senderName}>{item.sender?.name}</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
        ]}>
          {item.content && (
            <Text style={styles.messageText}>{item.content}</Text>
          )}
          
          {item.attachments && item.attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {item.attachments.map((attachment, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => handleOpenAttachment(attachment)}
                  style={styles.attachmentItem}
                >
                  {attachment.file_type === 'image' ? (
                    <Image 
                      source={{ uri: attachment.file_url }} 
                      style={styles.attachmentImage} 
                    />
                  ) : (
                    <View style={styles.documentAttachment}>
                      <MaterialCommunityIcons name="file-document" size={24} color={theme.colors.primary} />
                      <Text style={styles.attachmentName} numberOfLines={1}>
                        {attachment.file_name}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Text style={styles.messageTime}>
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            {isOwnMessage && (
              <MaterialCommunityIcons 
                name={item.read ? "check-all" : "check"} 
                size={16} 
                color={item.read ? theme.colors.primary : "#999"} 
              />
            )}
          </Text>
        </View>
      </View>
    );
  };

  const handleOpenAttachment = (attachment) => {
    if (attachment.file_type === 'image') {
      navigation.navigate('ImageViewer', { imageUrl: attachment.file_url });
    } else {
      // Open document viewer
      Linking.openURL(attachment.file_url);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>
                {isGroup ? `Someone is typing...` : `${recipientName} is typing...`}
              </Text>
            </View>
          )}
          
          {attachments.length > 0 && (
            <View style={styles.attachmentsPreviewContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {attachments.map((attachment, index) => (
                  <View key={index} style={styles.attachmentPreview}>
                    {attachment.type === 'image' ? (
                      <Image source={{ uri: attachment.uri }} style={styles.attachmentPreviewImage} />
                    ) : (
                      <View style={styles.documentPreview}>
                        <MaterialCommunityIcons name="file-document" size={24} color={theme.colors.primary} />
                        <Text style={styles.documentName} numberOfLines={1}>
                          {attachment.name}
                        </Text>
                      </View>
                    )}
                    <IconButton
                      icon="close"
                      size={16}
                      onPress={() => removeAttachment(index)}
                      style={styles.removeAttachmentButton}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <View style={styles.attach