import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider, FAB, Searchbar, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchConversations } from '../../services/MessagingService';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export default function ConversationsScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    loadConversations();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(conversation => {
        // For group chats, search in the title
        if (conversation.is_group && conversation.title) {
          return conversation.title.toLowerCase().includes(searchQuery.toLowerCase());
        }
        
        // For direct messages, search in participant names
        const otherParticipants = conversation.participants
          .filter(p => p.user_id !== user.id)
          .map(p => p.user.full_name);
        
        return otherParticipants.some(name => 
          name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);
  
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchConversations(user.id);
      setConversations(data);
      setFilteredConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getConversationTitle = (conversation) => {
    if (conversation.is_group && conversation.title) {
      return conversation.title;
    }
    
    // For direct messages, show the other participant's name
    const otherParticipants = conversation.participants
      .filter(p => p.user_id !== user.id)
      .map(p => p.user.full_name);
    
    return otherParticipants.join(', ') || 'Unknown';
  };
  
  const getAvatarText = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getLastMessagePreview = (conversation) => {
    if (!conversation.last_message || !conversation.last_message[0]) {
      return 'No messages yet';
    }
    
    const lastMessage = conversation.last_message[0];
    const isSender = lastMessage.sender_id === user.id;
    const prefix = isSender ? 'You: ' : '';
    
    return `${prefix}${lastMessage.content.substring(0, 30)}${lastMessage.content.length > 30 ? '...' : ''}`;
  };
  
  const getLastMessageTime = (conversation) => {
    if (!conversation.last_message || !conversation.last_message[0]) {
      return '';
    }
    
    return formatDistanceToNow(new Date(conversation.last_message[0].created_at), { addSuffix: true });
  };
  
  const handleConversationPress = (conversation) => {
    navigation.navigate('ChatScreen', {
      conversationId: conversation.id,
      title: getConversationTitle(conversation),
      isGroup: conversation.is_group
    });
  };
  
  const handleNewConversation = () => {
    navigation.navigate('NewConversation');
  };
  
  const renderConversationItem = ({ item }) => {
    const title = getConversationTitle(item);
    const lastMessage = getLastMessagePreview(item);
    const lastMessageTime = getLastMessageTime(item);
    
    return (
      <TouchableOpacity 
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item)}
      >
        {item.is_group ? (
          <Avatar.Icon 
            size={50} 
            icon="account-group" 
            style={styles.groupAvatar} 
          />
        ) : (
          <Avatar.Text 
            size={50} 
            label={getAvatarText(title)} 
            style={styles.avatar} 
          />
        )}
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={