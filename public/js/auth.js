// auth.js
import { auth } from "./modules/database.js"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    alert("Gagal login dengan Google.");
  }
}

async function logoutAdmin() {
  try {
    await signOut(auth);
    console.log("Admin logged out successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Gagal logout.");
  }
}

function monitorAuthState(callback) {
  onAuthStateChanged(auth, callback);
}

export { signInWithGoogle, logoutAdmin, monitorAuthState };
