import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";

// Definir el nombre de la colección que vamos a utilizar de esa base de datos
const collectionName = "users";

// Definir la referencia a la colección que vamos a utilizar
const usersCollectionRef = collection(db, collectionName);

// CREATE
const createUser = async (user) => {
    try {
        const docRef = await addDoc(usersCollectionRef, user);
        return docRef;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
};

// READ
const getUsers = async () => {
    try {
        const data = await getDocs(usersCollectionRef);
        const users = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return users;
    } catch (error) {
        console.error("Error getting users:", error);
        throw new Error("Failed to retrieve users");
    }
};

// READ by ID
const getUserByID = async (id) => {
    try {
        const userRef = doc(db, collectionName, id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        } else {
            console.error("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting user:", error);
        throw new Error("Failed to retrieve user by ID");
    }
};

// UPDATE
const updateUser = async (id, user) => {
    const userRef = doc(db, collectionName, id);
    try {
        await updateDoc(userRef, user);
        return userRef;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
    }
};

// DELETE
const deleteUser = async (id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
};

// UPLOAD IMAGE and LINK TO USER
const uploadUserImage = async (userId, imageFile) => {
    try {
        // Crear una referencia en Storage para la imagen
        const imageRef = ref(storage, `userImages/${userId}/${imageFile.name}`);
        
        // Subir la imagen a Storage
        const snapshot = await uploadBytes(imageRef, imageFile);
        
        // Obtener la URL de descarga de la imagen
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Actualizar el documento del usuario con la URL de la imagen
        const userRef = doc(db, collectionName, userId);
        await updateDoc(userRef, { imageUrl: downloadURL });

        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image and link to user");
    }
};

export { getUsers, createUser, updateUser, deleteUser, getUserByID, uploadUserImage };
