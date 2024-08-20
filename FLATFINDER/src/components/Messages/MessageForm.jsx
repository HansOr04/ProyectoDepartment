import React, { useState } from 'react';
import { sendMessage } from '../../services/firebasemessages';

const MessageForm = ({ flatId }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(flatId, message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="w-full p-2 border rounded"
      />
      <button 
        type="submit" 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enviar
      </button>
    </form>
  );
};

export default MessageForm;