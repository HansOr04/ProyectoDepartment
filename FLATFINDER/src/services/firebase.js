// Importaciones necesarias de Firebase
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, storage, auth } from "../config/firebase";

// Definir el nombre de la colección que vamos a utilizar de esa base de datos
const collectionName = "users";

// Definir la referencia a la colección que vamos a utilizar
const usersCollectionRef = collection(db, collectionName);

// Función para obtener el ID del usuario autenticado
const getAuthenticatedUserId = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Dejar de escuchar después de obtener el estado de autenticación
            if (user) {
                resolve(user.uid);
            } else {
                reject(new Error("No se encontró un usuario autenticado"));
            }
        });
    });
};

// Función para autenticar al usuario
const authenticateUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, collectionName, user.uid));
        
        if (userDoc.exists()) {
            return { uid: user.uid, ...userDoc.data() };
        } else {
            console.error("No se encontró el documento del usuario en Firestore");
            return null;
        }
    } catch (error) {
        console.error("Error al autenticar al usuario:", error);
        throw new Error("No se pudo autenticar al usuario");
    }
};

// Función para crear un nuevo usuario
const createUser = async (user) => {
    try {
        const docRef = await addDoc(usersCollectionRef, user);
        return docRef;
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        throw new Error("No se pudo crear el usuario");
    }
};

// Función para obtener todos los usuarios
const getUsers = async () => {
    try {
        const data = await getDocs(usersCollectionRef);
        const users = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return users;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw new Error("No se pudieron recuperar los usuarios");
    }
};

// Función para obtener un usuario por su ID
const getUserByID = async (id) => {
    try {
        const userRef = doc(db, collectionName, id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        } else {
            console.error("Usuario no encontrado");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw new Error("No se pudo recuperar el usuario por ID");
    }
};

// Función para actualizar un usuario
const updateUser = async (id, user) => {
    const userRef = doc(db, collectionName, id);
    try {
        await updateDoc(userRef, user);
        return userRef;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        throw new Error("No se pudo actualizar el usuario");
    }
};

// Función para eliminar un usuario
const deleteUser = async (id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return true;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        throw new Error("No se pudo eliminar el usuario");
    }
};

// Función para subir una imagen de usuario y devolver su UID
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
        console.error("Error al subir la imagen:", error);
        throw new Error("No se pudo subir la imagen y vincularla al usuario");
    }
};

// Exportar todas las funciones
export { 
    getAuthenticatedUserId, authenticateUser, getUsers, createUser, updateUser, deleteUser, getUserByID, uploadUserImage 
};