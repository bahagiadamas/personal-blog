import * as firebase from "./firebase.js";

async function signInWithGoogle() {
  const provider = new firebase.GoogleAuthProvider();
  try {
    const result = await firebase.signInWithPopup(firebase.auth, provider);
    const user = result.user;
    console.log("User UID:", user.uid);
    await firebase.saveUserData(user);
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    alert("Gagal login dengan Google.");
  }
}

async function logoutAdmin() {
  try {
    await firebase.signOut(firebase.auth);
    console.log("Admin logged out successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Gagal logout.");
  }
}

function monitorAuthState(callback) {
  firebase.onAuthStateChanged(firebase.auth, callback);
}

export { signInWithGoogle, logoutAdmin, monitorAuthState };
