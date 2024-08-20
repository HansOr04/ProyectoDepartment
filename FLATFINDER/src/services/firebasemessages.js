//Aqui se debera configurar los servicios de firebase para los mensajes que se podran colocar en cada flat 
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, storage } from "../config/firebase";


export const sendMessage = async (flatId, message) => {
  try {
    await addDoc(collection(db, `flats/${flatId}/messages`), {
      text: message,
      createdAt: new Date(),
      // Puedes agregar más campos como userId, userName, etc.
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
};

export const subscribeToMessages = (flatId, callback) => {
  const q = query(collection(db, `flats/${flatId}/messages`), orderBy('createdAt'));
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};