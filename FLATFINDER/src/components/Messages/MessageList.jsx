import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Button } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { subscribeToMessages } from '../../services/firebasemessages';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../config/firebase';

const MessagesList = ({ flatId, currentUser, flatOwner, onReply }) => {
  const [messages, setMessages] = useState([]);
  const [avatarUrls, setAvatarUrls] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToMessages(flatId, (newMessages) => {
      console.log("Received new messages:", newMessages); // Added log
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, [flatId]);

  useEffect(() => {
    const fetchAvatarUrls = async () => {
      const urls = {};
      for (const msg of messages) {
        console.log("Processing message:", msg); // Added log
        if (msg.imageUid && !avatarUrls[msg.imageUid]) {
          console.log("Fetching URL for imageUid:", msg.imageUid); // Added log
          try {
            const imageRef = ref(storage, msg.imageUid);
            const url = await getDownloadURL(imageRef);
            console.log("Fetched URL:", url); // Added log
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

  const renderMessage = (msg) => {
    const userName = msg.userName || 'Usuario Anónimo';
    const avatarLetter = userName.charAt(0).toUpperCase();
    const avatarUrl = avatarUrls[msg.imageUid];
    console.log("Rendering message:", msg.id, "Avatar URL:", avatarUrl); // Added log

    return (
      <ListItem key={msg.id} alignItems="flex-start" sx={{ flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <ListItemAvatar>
            <Avatar src={avatarUrl} alt={userName}>
              {avatarLetter}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={userName}
            secondary={
              <>
                <Typography component="span" variant="body2" color="text.primary">
                  {msg.text}
                </Typography>
                <Typography component="span" variant="caption" display="block">
                  {msg.createdAt?.toDate().toLocaleString() || 'Fecha desconocida'}
                </Typography>
              </>
            }
          />
        </Box>
        {currentUser?.id === flatOwner && (
          <Button
            startIcon={<ReplyIcon />}
            onClick={() => onReply(msg)}
            sx={{ alignSelf: 'flex-end' }}
          >
            Responder
          </Button>
        )}
        {msg.replyTo && (
          <Box sx={{ ml: 6, mt: 1, borderLeft: '2px solid #ccc', pl: 2 }}>
            <Typography variant="caption">
              En respuesta a {messages.find(m => m.id === msg.replyTo)?.userName || 'Usuario Anónimo'}:
            </Typography>
            <Typography variant="body2">
              {messages.find(m => m.id === msg.replyTo)?.text || 'Mensaje no disponible'}
            </Typography>
          </Box>
        )}
      </ListItem>
    );
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {messages.map(renderMessage)}
    </List>
  );
};

export default MessagesList;