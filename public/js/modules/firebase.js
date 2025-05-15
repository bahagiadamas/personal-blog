import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import {
  getAnalytics,
  logEvent,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHNhYJJZuy1_1kPhh2dGQSC46gIrINYlk",
  authDomain: "bahagiadamas.firebaseapp.com",
  projectId: "bahagiadamas",
  storageBucket: "bahagiadamas.firebasestorage.app",
  messagingSenderId: "22737524500",
  appId: "1:22737524500:web:e9ab011c0790db4df4d401",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

async function getData(collectionName, orderByField = "createdAt") {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, "asc")
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${collectionName}:`, error);
    return [];
  }
}

export {
  db,
  getData,
  analytics,
  logEvent,
  auth,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  setDoc,
  updateDoc,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  addDoc,
  deleteDoc,
};
