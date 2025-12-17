import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, VStack, HStack, Avatar, Text, 
  Spinner, Flex, Divider
} from '@chakra-ui/react';

const InboxPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // Ambil semua pesan yang melibatkan user (sebagai pengirim ATAU penerima)
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (id, full_name, avatar_url),
          receiver:receiver_id (id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false }); // Pesan terbaru di atas

      if (error) throw error;

      // PROSES DATA: Kelompokkan per lawan bicara (Unique Conversation)
      const uniqueChats = [];
      const visitedIds = new Set();

      data.forEach((msg) => {
        // Tentukan siapa lawan bicaranya
        const isMeSender = msg.sender_id === user.id;
        const partner = isMeSender ? msg.receiver : msg.sender;
        
        // Jika partner ini belum ada di list, masukkan sebagai percakapan baru
        if (!visitedIds.has(partner.id)) {
          visitedIds.add(partner.id);
          uniqueChats.push({
            partnerId: partner.id,
            partnerName: partner.full_name,
            partnerAvatar: partner.avatar_url,
            lastMessage: msg.content,
            timestamp: msg.created_at
          });
        }
      });

      setConversations(uniqueChats);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Flex justify="center" h="100vh" align="center"><Spinner size="xl" /></Flex>;

  return (
    <Container maxW="container.md" py={10}>
      <Heading mb={6}>Kotak Masuk</Heading>

      {conversations.length === 0 ? (
        <Text color="gray.500">Belum ada percakapan.</Text>
      ) : (
        <VStack align="stretch" spacing={0} borderWidth={1} borderRadius="xl" overflow="hidden">
          {conversations.map((chat, index) => (
            <Box key={chat.partnerId}>
              <HStack 
                p={4} 
                bg="white" 
                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                onClick={() => navigate(`/chat/${chat.partnerId}`)}
                align="start"
              >
                <Avatar src={chat.partnerAvatar} name={chat.partnerName} />
                <Box flex={1}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">{chat.partnerName}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(chat.timestamp).toLocaleDateString('id-ID')}
                    </Text>
                  </Flex>
                  <Text noOfLines={1} color="gray.600" fontSize="sm">
                    {chat.lastMessage}
                  </Text>
                </Box>
              </HStack>
              {index < conversations.length - 1 && <Divider />}
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default InboxPage;