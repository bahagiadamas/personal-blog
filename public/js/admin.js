import * as firebase from "./modules/firebase.js";
import * as auth from "./modules/auth.js";
import * as project from "./modules/project.js";

function addItem() {
  window.location.href = "new-project.html";
}

function handleAuthState(user) {
  const loginGoogleBtn = document.getElementById("loginGoogle");
  const logoutGoogleBtn = document.getElementById("logoutGoogle");
  const verifiedSection = document.querySelector(".logged-in");
  const unverifiedSection = document.querySelector(".logged-out");
  const authMessage = document.querySelector(".auth-message");

  if (!user) {
    if (loginGoogleBtn) {
      loginGoogleBtn.style.display = "flex";
      loginGoogleBtn.addEventListener("click", auth.signInWithGoogle);
    }
    if (logoutGoogleBtn) {
      logoutGoogleBtn.style.display = "none";
    }
    if (unverifiedSection) {
      unverifiedSection.style.display = "block";
    }
    if (verifiedSection) {
      verifiedSection.style.display = "none";
    }
    if (authMessage) {
      authMessage.textContent =
        "You are not logged in, please login to verify your identity";
    }
  } else {
    if (loginGoogleBtn) {
      loginGoogleBtn.style.display = "none";
    }
    if (logoutGoogleBtn) {
      logoutGoogleBtn.style.display = "flex";
      logoutGoogleBtn.addEventListener("click", auth.logoutAdmin);
    }

    if (user.uid === "Dz1UtNSZcRdE1GAHKhotC7Li4Al2") {
      if (verifiedSection) {
        verifiedSection.style.display = "block";
      }
      if (unverifiedSection) {
        unverifiedSection.style.display = "none";
      }
      if (authMessage) {
        authMessage.textContent = "";
      }
      project.loadProjectData();
    } else {
      if (verifiedSection) {
        verifiedSection.style.display = "none";
      }
      if (unverifiedSection) {
        unverifiedSection.style.display = "block";
      }
      if (authMessage) {
        authMessage.textContent = "You are not authorized to access this page.";
      }
    }
  }
}

async function adminInit() {
  firebase.auth.onAuthStateChanged(handleAuthState);
  document.getElementById("addItem").addEventListener("click", addItem);
}

document.addEventListener("DOMContentLoaded", adminInit);
