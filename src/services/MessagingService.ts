import { supabase } from '../lib/supabase';

export const fetchConversations = async (userId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants(
        user_id,
        user:profiles(id, full_name, avatar_url)
      ),
      last_message:messages(
        id,
        content,
        created_at,
        sender_id
      )
    `)
    .eq('conversation_participants.user_id', userId)
    .order('last_message_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const fetchMessages = async (conversationId, limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(id, full_name, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return data || [];
};

export const sendMessage = async (conversationId, senderId, content, attachmentUrl = null) => {
  // Insert the message
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      attachment_url: attachmentUrl
    })
    .select();
  
  if (error) throw error;
  
  // Update the conversation's last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  
  return data[0];
};

export const createConversation = async (creatorId, participantIds, title = null, isGroup = false) => {
  // Start a transaction
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      created_by: creatorId,
      title,
      is_group: isGroup,
      last_message_at: new Date().toISOString()
    })
    .select();
  
  if (conversationError) throw conversationError;
  
  // Add all participants (including creator)
  const allParticipants = [...new Set([creatorId, ...participantIds])];
  const participants = allParticipants.map(userId => ({
    conversation_id: conversation[0].id,
    user_id: userId
  }));
  
  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participants);
  
  if (participantsError) throw participantsError;
  
  return conversation[0];
};

export const subscribeToConversation = (conversationId, onNewMessage) => {
  const subscription = supabase
    .channel(`conversation:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      onNewMessage(payload.new);
    })
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
};