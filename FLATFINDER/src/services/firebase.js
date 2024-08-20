import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, storage, auth } from "../config/firebase";

// Definir el nombre de la colección que vamos a utilizar de esa base de datos
const collectionName = "users";

// Definir la referencia a la colección que vamos a utilizar
const usersCollectionRef = collection(db, collectionName);

const getAuthenticatedUserId = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Dejar de escuchar después de obtener el estado de autenticación
            if (user) {
                resolve(user.uid);
            } else {
                reject(new Error("No authenticated user found"));
            }
        });
    });
};

// AUTHENTICATE
const authenticateUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, collectionName, user.uid));
        
        if (userDoc.exists()) {
            return { uid: user.uid, ...userDoc.data() };
        } else {
            console.error("User document not found in Firestore");
            return null;
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw new Error("Failed to authenticate user");
    }
};

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

// UPLOAD IMAGE and RETURN UID
const uploadUserImage = async (userId, imageFile) => {
    try {
        // Crear una referencia en Storage para la imagen
        const imageRef = ref(storage, `userImages/${userId}/${imageFile.name}`);
        
        // Subir la imagen a Storage
        await uploadBytes(imageRef, imageFile);
        
        // Crear el UID de la imagen (ruta relativa en el storage)
        const imageUid = `userImages/${userId}/${imageFile.name}`;
        
        // Actualizar el documento del usuario con el UID de la imagen
        const userRef = doc(db, collectionName, userId);
        await updateDoc(userRef, { imageUid: imageUid });

        return imageUid;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image and link to user");
    }
};

export { 
    getAuthenticatedUserId, authenticateUser, getUsers, createUser, updateUser, deleteUser, getUserByID, uploadUserImage };