import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";

// Definir el nombre de la colección que vamos a utilizar de esa base de datos
const collectionName = "flats";

// Definir la referencia a la colección que vamos a utilizar
const flatsCollectionRef = collection(db, collectionName);

// CREATE
const createFlat = async (flat) => {
    try {
        const docRef = await addDoc(flatsCollectionRef, flat);
        return docRef;
    } catch (error) {
        console.error("Error creating flat:", error);
        throw new Error("Failed to create flat");
    }
};

// READ
const getFlats = async () => {
    try {
        const data = await getDocs(flatsCollectionRef);
        const flats = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return flats;
    } catch (error) {
        console.error("Error getting flats:", error);
        throw new Error("Failed to retrieve flats");
    }
};

// READ by ID
const getFlatByID = async (id) => {
    try {
        const flatRef = doc(db, collectionName, id);
        const flatDoc = await getDoc(flatRef);
        if (flatDoc.exists()) {
            return { id: flatDoc.id, ...flatDoc.data() };
        } else {
            console.error("Flat not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting flat:", error);
        throw new Error("Failed to retrieve flat by ID");
    }
};

// UPDATE
const updateFlat = async (id, flat) => {
    const flatRef = doc(db, collectionName, id);
    try {
        await updateDoc(flatRef, flat);
        return flatRef;
    } catch (error) {
        console.error("Error updating flat:", error);
        throw new Error("Failed to update flat");
    }
};

// DELETE
const deleteFlat = async (id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return true;
    } catch (error) {
        console.error("Error deleting flat:", error);
        throw new Error("Failed to delete flat");
    }
};

// UPLOAD IMAGE and RETURN URL
const uploadFlatImage = async (flatId, imageFile) => {
    try {
        // Crear una referencia en Storage para la imagen
        const imageRef = ref(storage, `flatImages/${flatId}/${imageFile.name}`);
        
        // Subir la imagen a Storage
        await uploadBytes(imageRef, imageFile);
        
        // Obtener la URL de descarga de la imagen
        const downloadURL = await getDownloadURL(imageRef);
        
        // Actualizar el documento del flat con la URL de la imagen
        const flatRef = doc(db, collectionName, flatId);
        await updateDoc(flatRef, { imageURL: downloadURL });

        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image and link to flat");
    }
};

// LINK FLAT TO USER
const linkFlatToUser = async (flatId, userId) => {
    try {
        const flatRef = doc(db, collectionName, flatId);
        await updateDoc(flatRef, { ownerId: userId });
        return true;
    } catch (error) {
        console.error("Error linking flat to user:", error);
        throw new Error("Failed to link flat to user");
    }
};

// GET FLATS BY USER
const getFlatsByUser = async (userId) => {
    try {
        const q = query(flatsCollectionRef, where("ownerId", "==", userId));
        const querySnapshot = await getDocs(q);
        const flats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return flats;
    } catch (error) {
        console.error("Error getting flats by user:", error);
        throw new Error("Failed to retrieve flats by user");
    }
};

export { 
    getFlats, 
    createFlat, 
    updateFlat, 
    deleteFlat, 
    getFlatByID, 
    uploadFlatImage, 
    linkFlatToUser, 
    getFlatsByUser 
};