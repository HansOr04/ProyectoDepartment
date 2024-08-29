import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, IconButton } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { subscribeToMessages } from '../../services/firebasemessages';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../config/firebase';

const MessagesList = ({ flatId, currentUser, flatOwner, onReply }) => {
  const [messages, setMessages] = useState([]);
  const [avatarUrls, setAvatarUrls] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToMessages(flatId, (newMessages) => {
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, [flatId]);

  useEffect(() => {
    const fetchAvatarUrls = async () => {
      const urls = {};
      for (const msg of messages) {
        if (msg.imageUid && !avatarUrls[msg.imageUid]) {
          try {
            const imageRef = ref(storage, msg.imageUid);
            const url = await getDownloadURL(imageRef);
            urls[msg.imageUid] = url;
          } catch (error) {
            console.error("Error getting avatar URL:", error);
            urls[msg.imageUid] = null;
          }
        }
      }
      setAvatarUrls(prevUrls => ({ ...prevUrls, ...urls }));
    };

    fetchAvatarUrls();
  }, [messages]);

  const toggleReplies = (messageId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const canReply = (msg) => {
    return (
      currentUser.id === flatOwner || // Flat owner can reply to all
      (msg.userId === flatOwner && msg.replyTo === currentUser.id) // Message owner can reply to flat owner's response
    );
  };

  const renderMessage = (msg, isReply = false) => {
    const userName = msg.userName || 'Usuario Anónimo';
    const avatarLetter = userName.charAt(0).toUpperCase();
    const avatarUrl = avatarUrls[msg.imageUid];
    const replies = messages.filter(m => m.replyTo === msg.id);

    return (
      <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column', mb: 2, ml: isReply ? 4 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar src={avatarUrl} alt={userName} sx={{ mr: 1, width: 24, height: 24 }}>
            {avatarLetter}
          </Avatar>
          <Typography variant="subtitle2" component="span">{userName}</Typography>
          {canReply(msg) && (
            <IconButton size="small" onClick={() => onReply(msg)} sx={{ ml: 1 }}>
              <ReplyIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 1, maxWidth: '80%', alignSelf: 'flex-start' }}>
          <Typography variant="body2">{msg.text}</Typography>
        </Box>
        <Typography variant="caption" sx={{ mt: 0.5 }}>
          {msg.createdAt?.toDate().toLocaleString() || 'Fecha desconocida'}
        </Typography>
        
        {!isReply && replies.length > 0 && (
          <Button 
            onClick={() => toggleReplies(msg.id)} 
            sx={{ alignSelf: 'flex-start', mt: 1, color: 'primary.main', textTransform: 'none' }}
          >
            {expandedReplies[msg.id] ? 'Ocultar' : `${replies.length} respuestas`}
          </Button>
        )}
        
        {!isReply && expandedReplies[msg.id] && (
          <Box sx={{ mt: 1 }}>
            {replies.map(reply => renderMessage(reply, true))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 2 }}>
      {messages.filter(msg => !msg.replyTo).map(msg => renderMessage(msg))}
    </Box>
  );
};

export default MessagesList;