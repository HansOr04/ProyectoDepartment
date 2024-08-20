import { 
    addDoc, 
    collection, 
    deleteDoc, 
    doc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    query, 
    where, 
    arrayUnion, 
    arrayRemove 
  } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { db, storage } from "../config/firebase";
  
  // Define the name of the collection we're going to use from the database
  const collectionName = "flats";
  const usersCollectionName = "users";
  
  // Define the reference to the collection we're going to use
  const flatsCollectionRef = collection(db, collectionName);
  
  // CREATE
  const createFlat = async (flat, userId) => {
      try {
          const flatWithOwner = { ...flat, ownerId: userId };
          const docRef = await addDoc(flatsCollectionRef, flatWithOwner);
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
          const imageRef = ref(storage, `flatImages/${flatId}/${imageFile.name}`);
          await uploadBytes(imageRef, imageFile);
          const downloadURL = await getDownloadURL(imageRef);
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
  
  // GET ALL FLATS WITH OWNERS
  const getAllFlatsWithOwners = async () => {
      try {
          const flatsSnapshot = await getDocs(flatsCollectionRef);
          const flatsWithOwners = await Promise.all(flatsSnapshot.docs.map(async (flatDoc) => {
              const flatData = flatDoc.data();
              const flatId = flatDoc.id;
              let ownerData = null;
              if (flatData.ownerId) {
                  const ownerRef = doc(db, usersCollectionName, flatData.ownerId);
                  const ownerSnapshot = await getDoc(ownerRef);
                  if (ownerSnapshot.exists()) {
                      ownerData = ownerSnapshot.data();
                  }
              }
              return {
                  id: flatId,
                  ...flatData,
                  owner: ownerData ? {
                      id: flatData.ownerId,
                      name: ownerData.name,
                      email: ownerData.email
                  } : null
              };
          }));
          return flatsWithOwners;
      } catch (error) {
          console.error("Error getting flats with owners:", error);
          throw new Error("Failed to retrieve flats with owner information");
      }
  };
  
  // ADD TO FAVORITES
  const addToFavorites = async (userId, flatId) => {
      try {
          const userRef = doc(db, usersCollectionName, userId);
          await updateDoc(userRef, {
              favorites: arrayUnion(flatId)
          });
      } catch (error) {
          console.error("Error adding to favorites:", error);
          throw new Error("Failed to add flat to favorites");
      }
  };
  
  // REMOVE FROM FAVORITES
  const removeFavorite = async (userId, flatId) => {
      try {
          const userRef = doc(db, usersCollectionName, userId);
          await updateDoc(userRef, {
              favorites: arrayRemove(flatId)
          });
      } catch (error) {
          console.error("Error removing from favorites:", error);
          throw new Error("Failed to remove flat from favorites");
      }
  };
  
  // GET USER FAVORITES
  const getUserFavorites = async (userId) => {
      try {
          const userRef = doc(db, usersCollectionName, userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
              const favorites = userDoc.data().favorites || [];
              const favoriteFlats = await Promise.all(
                  favorites.map(async (flatId) => {
                      const flatDoc = await getFlatByID(flatId);
                      return flatDoc;
                  })
              );
              return favoriteFlats.filter(flat => flat !== null);
          }
          return [];
      } catch (error) {
          console.error("Error getting user favorites:", error);
          throw new Error("Failed to get user favorites");
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
      getFlatsByUser,
      getAllFlatsWithOwners,
      addToFavorites,
      removeFavorite,
      getUserFavorites
  };