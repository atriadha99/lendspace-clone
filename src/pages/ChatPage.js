import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Box, Container, VStack, HStack, Input, IconButton, Text, Flex } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

const ChatPage = () => {
  const { receiverId } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    let channel;
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Fetch History
      const { data } = await supabase.from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      setMessages(data || []);

      // Realtime Sub
      channel = supabase.channel('chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
           if(payload.new.sender_id === receiverId || payload.new.sender_id === user.id) {
             setMessages(prev => [...prev, payload.new]);
           }
        }).subscribe();
    };
    init();
    return () => { if(channel) supabase.removeChannel(channel); };
  }, [receiverId]);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const send = async () => {
    if (!text.trim()) return;
    await supabase.from('messages').insert({ sender_id: user.id, receiver_id: receiverId, content: text });
    setText('');
  };

  return (
    <Container maxW="md" h="80vh" py={4} display="flex" flexDirection="column">
      <Box bg="gray.100" p={3} borderRadius="md" mb={2}><Text fontWeight="bold">Chat Room</Text></Box>
      <VStack flex={1} overflowY="auto" spacing={3} align="stretch" mb={4} px={2}>
        {messages.map(m => (
          <Flex key={m.id} justify={m.sender_id === user.id ? 'flex-end' : 'flex-start'}>
            <Box bg={m.sender_id === user.id ? 'blue.500' : 'gray.200'} color={m.sender_id === user.id ? 'white' : 'black'} px={3} py={2} borderRadius="lg">
              {m.content}
            </Box>
          </Flex>
        ))}
        <div ref={bottomRef} />
      </VStack>
      <HStack>
        <Input value={text} onChange={e => setText(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} />
        <IconButton icon={<ArrowRightIcon />} onClick={send} colorScheme="blue" />
      </HStack>
    </Container>
  );
};
export default ChatPage;