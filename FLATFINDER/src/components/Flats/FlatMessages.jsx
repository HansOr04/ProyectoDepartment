// Importaciones necesarias de React y hooks
import React, { useState, useEffect } from 'react';
// Importaciones de componentes de Material-UI
import { Box, Typography, Paper } from '@mui/material';
// Importaciones de componentes personalizados para manejo de mensajes
import MessageForm from '../Messages/MessageForm';
import MessagesList from '../Messages/MessageList';

// Definición del componente FlatMessages
// Recibe flatId, currentUser y flatOwner como props
const FlatMessages = ({ flatId, currentUser, flatOwner }) => {
  // Estado para manejar la respuesta a un mensaje específico
  const [replyToMessage, setReplyToMessage] = useState(null);

  // Efecto para loguear el usuario actual cuando cambia
  useEffect(() => {
    console.log("Current user in FlatMessages:", currentUser);
  }, [currentUser]);

  // Manejador para iniciar una respuesta a un mensaje
  const handleReply = (message) => {
    setReplyToMessage(message);
  };

  // Manejador para cancelar la respuesta a un mensaje
  const handleReplyCancel = () => {
    setReplyToMessage(null);
  };

  // Si no hay usuario actual, mostrar mensaje de error
  if (!currentUser) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography color="error">
          Debes iniciar sesión para ver y enviar mensajes.
        </Typography>
      </Paper>
    );
  }

  // Renderizado principal del componente
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Mensajes del Flat
      </Typography>
      {/* Componente para listar los mensajes */}
      <MessagesList 
        flatId={flatId} 
        currentUser={currentUser} 
        flatOwner={flatOwner} 
        onReply={handleReply} 
      />
      {/* Componente para enviar nuevos mensajes o responder */}
      <MessageForm 
        flatId={flatId} 
        currentUser={currentUser} 
        replyToMessage={replyToMessage}
        onReplyCancel={handleReplyCancel}
      />
    </Paper>
  );
};

export default FlatMessages;