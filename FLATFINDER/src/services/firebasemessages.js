import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, storage } from "../config/firebase";

export const sendMessage = async (flatId, messageData) => {
  try {
    if (!flatId) {
      throw new Error('flatId is required');
    }
    if (!messageData.text) {
      throw new Error('Message text is required');
    }
    if (!messageData.userId) {
      throw new Error('userId is required');
    }

    const messageToSend = {
      text: messageData.text,
      userId: messageData.userId,
      userName: messageData.userName || 'Usuario Anónimo',
      imageUid: messageData.imageUid || null,
      createdAt: new Date(),
      replyTo: messageData.replyTo || null
    };

    console.log("Sending message:", messageToSend); // Added log

    const messagesRef = collection(db, `flats/${flatId}/messages`);
    await addDoc(messagesRef, messageToSend);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    throw error;
  }
};

export const subscribeToMessages = (flatId, callback) => {
  console.log("Subscribing to messages for flat:", flatId); // Added log
  const q = query(collection(db, `flats/${flatId}/messages`), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text || '',
        userName: data.userName || 'Usuario Anónimo',
        userId: data.userId || '',
        createdAt: data.createdAt || new Date(),
        replyTo: data.replyTo || null,
        imageUid: data.imageUid || null // Ensure imageUid is included
      };
    });
    console.log("Received messages:", messages); // Added log
    callback(messages);
  });
};