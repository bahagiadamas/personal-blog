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

function formatToGMT7(date) {
  const options = {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-GB", options).format(date) + " GMT+7";
}

async function saveUserData(user) {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const joined = formatToGMT7(new Date(user.metadata.creationTime));
    const lastSeen = formatToGMT7(new Date());

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      await setDoc(userRef, {
        displayName: displayName || "",
        email: email || "",
        photoURL: photoURL || "",
        providerId: user.providerData[0]?.providerId || "google.com",
        creationTime: joined,
        lastSignInTime: lastSeen,
      });
      console.log("Data pengguna Google baru disimpan ke Firestore.");
    } else {
      await updateDoc(userRef, {
        lastSignInTime: lastSeen,
      });
    }
  }
}

async function getData(collectionName, orderByField = null) {
  try {
    let q;
    if (orderByField) {
      q = query(collection(db, collectionName), orderBy(orderByField, "asc"));
    } else {
      q = query(collection(db, collectionName));
    }
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
  saveUserData,
};
