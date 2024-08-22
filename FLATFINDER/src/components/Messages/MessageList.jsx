// Importaciones necesarias de React y Material-UI
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Button } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
// Importaciones de servicios de Firebase
import { subscribeToMessages } from '../../services/firebasemessages';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../config/firebase';

// Definición del componente MessagesList
const MessagesList = ({ flatId, currentUser, flatOwner, onReply }) => {
  // Estado para almacenar los mensajes
  const [messages, setMessages] = useState([]);
  // Estado para almacenar las URLs de los avatares
  const [avatarUrls, setAvatarUrls] = useState({});

  // Efecto para suscribirse a los mensajes del piso
  useEffect(() => {
    const unsubscribe = subscribeToMessages(flatId, (newMessages) => {
      console.log("Received new messages:", newMessages);
      setMessages(newMessages);
    });
    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe();
  }, [flatId]);

  // Efecto para obtener las URLs de los avatares
  useEffect(() => {
    const fetchAvatarUrls = async () => {
      const urls = {};
      for (const msg of messages) {
        console.log("Processing message:", msg);
        if (msg.imageUid && !avatarUrls[msg.imageUid]) {
          console.log("Fetching URL for imageUid:", msg.imageUid);
          try {
            const imageRef = ref(storage, msg.imageUid);
            const url = await getDownloadURL(imageRef);
            console.log("Fetched URL:", url);
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

  // Función para renderizar un mensaje individual
  const renderMessage = (msg) => {
    const userName = msg.userName || 'Usuario Anónimo';
    const avatarLetter = userName.charAt(0).toUpperCase();
    const avatarUrl = avatarUrls[msg.imageUid];
    console.log("Rendering message:", msg.id, "Avatar URL:", avatarUrl);

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
        {/* Botón de respuesta (solo visible para el propietario del piso) */}
        {currentUser?.id === flatOwner && (
          <Button
            startIcon={<ReplyIcon />}
            onClick={() => onReply(msg)}
            sx={{ alignSelf: 'flex-end' }}
          >
            Responder
          </Button>
        )}
        {/* Visualización de la respuesta si el mensaje es una respuesta */}
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

  // Renderizado de la lista de mensajes
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {messages.map(renderMessage)}
    </List>
  );
};

export default MessagesList;