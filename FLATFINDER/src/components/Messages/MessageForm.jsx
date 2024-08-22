// Importaciones necesarias de React y Material-UI
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
// Importación de la función para enviar mensajes desde el servicio de Firebase
import { sendMessage } from '../../services/firebasemessages';

// Definición del componente MessageForm
const MessageForm = ({ flatId, currentUser, replyToMessage, onReplyCancel }) => {
  // Estado para el contenido del mensaje
  const [message, setMessage] = useState('');
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Verificación de autenticación del usuario
    if (!currentUser) {
      setError('Debes iniciar sesión para enviar mensajes.');
      return;
    }

    // Verificación de la existencia del ID del usuario
    if (!currentUser.id) {
      setError('Error: No se pudo obtener el ID del usuario.');
      console.error("User object doesn't have id:", currentUser);
      return;
    }

    // Procesamiento y envío del mensaje
    if (message.trim()) {
      try {
        const messageData = {
          text: message.trim(),
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          imageUid: currentUser.imageUid,
          replyTo: replyToMessage ? replyToMessage.id : null,
        };
        console.log("Sending message with data:", messageData);
        
        await sendMessage(flatId, messageData);
        console.log("Message sent successfully");
        
        // Limpieza del formulario después del envío exitoso
        setMessage('');
        if (replyToMessage) {
          onReplyCancel();
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        setError(`No se pudo enviar el mensaje: ${error.message}`);
      }
    }
  };

  // Renderizado condicional si no hay usuario autenticado
  if (!currentUser) {
    return (
      <Typography color="error">
        Debes iniciar sesión para enviar mensajes.
      </Typography>
    );
  }

  // Renderizado principal del componente
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={replyToMessage ? `Responder a ${replyToMessage.userName}` : "Escribe un mensaje..."}
        InputProps={{
          endAdornment: (
            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={!message.trim()}>
              Enviar
            </Button>
          ),
        }}
      />
      {/* Botón para cancelar la respuesta si está respondiendo a un mensaje */}
      {replyToMessage && (
        <Button onClick={onReplyCancel} sx={{ mt: 1 }}>
          Cancelar respuesta
        </Button>
      )}
      {/* Mostrar mensaje de error si existe */}
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default MessageForm;