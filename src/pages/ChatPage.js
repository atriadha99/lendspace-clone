import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
// Sesuaikan path import supabaseClient Anda
import { supabase } from '../lib/supabaseClient'; 
import {
  Box, Container, VStack, HStack, Input, IconButton, Text, Spinner, Flex
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

const ChatPage = () => {
  const { receiverId } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // 1. Definisikan logika fetch & realtime DI DALAM useEffect
  // Ini menghilangkan warning "missing dependencies"
  useEffect(() => {
    let channel;

    const initChat = async () => {
      // Ambil User Login
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (!currentUser) return;

      // A. Fetch Pesan Lama
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        // Logic: Ambil pesan antra SAYA dan DIA (bolak-balik)
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (!error) setMessages(data || []);
      setLoading(false);

      // B. Subscribe Realtime
      channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const newMsg = payload.new;
          // Validasi: Hanya masukkan jika pesan ini milik percakapan kita
          if (
            (newMsg.sender_id === currentUser.id && newMsg.receiver_id === receiverId) ||
            (newMsg.sender_id === receiverId && newMsg.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        })
        .subscribe();
    };

    initChat();

    // Cleanup saat keluar halaman
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [receiverId]); // Dependency aman

  // 2. Auto scroll ke bawah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Kirim Pesan
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    // Optimistic UI (Langsung kosongkan input biar terasa cepat)
    const msgToSend = newMessage;
    setNewMessage('');

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content: msgToSend,
    });

    if (error) {
      console.error('Gagal kirim:', error);
      // Kembalikan teks jika gagal (opsional)
      setNewMessage(msgToSend); 
    }
  };

  return (
    <Container maxW="md" h="80vh" py={4} display="flex" flexDirection="column">
      {/* HEADER */}
      <Box bg="white" p={4} shadow="sm" borderRadius="lg" mb={4}>
        <Text fontWeight="bold">Chat Room</Text>
      </Box>

      {/* AREA PESAN */}
      <VStack flex={1} overflowY="auto" spacing={4} align="stretch" px={2} mb={4}>
        {loading && <Spinner alignSelf="center" />}
        
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <Flex key={msg.id} justify={isMe ? 'flex-end' : 'flex-start'}>
              <Box
                bg={isMe ? 'blue.500' : 'gray.100'}
                color={isMe ? 'white' : 'black'}
                px={4} py={2}
                borderRadius="lg"
                maxW="80%"
              >
                <Text fontSize="md">{msg.content}</Text>
                <Text fontSize="xs" opacity={0.7} textAlign="right">
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              </Box>
            </Flex>
          );
        })}
        <div ref={bottomRef} />
      </VStack>

      {/* INPUT BOX */}
      <HStack>
        <Input 
          placeholder="Tulis pesan..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          bg="white"
        />
        <IconButton 
          icon={<ArrowRightIcon />} 
          colorScheme="blue" 
          onClick={handleSendMessage}
          aria-label="Send"
        />
      </HStack>
    </Container>
  );
};

export default ChatPage;