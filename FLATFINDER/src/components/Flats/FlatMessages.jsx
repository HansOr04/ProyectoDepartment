import React from 'react';
import MessageForm from '../Messages/MessageForm';
import MessagesList from '../Messages/MessageList';

const FlatMessages = ({ flatId }) => {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Mensajes del Flat</h2>
      <MessagesList flatId={flatId} />
      <MessageForm flatId={flatId} />
    </div>
  );
};

export default FlatMessages;