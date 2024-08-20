//Componente para mostrar el listado de mensajes
import React, { useEffect, useState } from 'react';
import { subscribeToMessages } from '../../services/firebasemessages';

const MessagesList = ({ flatId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(flatId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [flatId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Mensajes</h3>
      <ul className="space-y-2">
        {messages.map((msg) => (
          <li key={msg.id} className="p-2 bg-gray-100 rounded">
            <p>{msg.text}</p>
            <small className="text-gray-500">
              {msg.createdAt.toDate().toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;