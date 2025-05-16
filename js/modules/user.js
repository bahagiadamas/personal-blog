import * as firebase from "./firebase.js";
import * as ui from "./ui.js";

async function displayUsers(users) {
  const userPlaceholder = document.getElementById("user_placeholder");
  if (!userPlaceholder) return;

  const notFoundEl = userPlaceholder.querySelector(".not-found");
  userPlaceholder.innerHTML = "";

  if (notFoundEl) {
    userPlaceholder.appendChild(notFoundEl);
    notFoundEl.style.display = "none";
  }

  if (userPlaceholder) {
    users.forEach((user) => {
      const userItem = document.createElement("div");
      userItem.className = "collection-item user popup";
      userItem.dataset.userId = user.id;
      userItem.addEventListener("click", () => {
        window.location.href = `user-detail.html?id${user.id}`;
      });

      const userImg = document.createElement("img");
      userImg.src = user.photoURL;
      userImg.className = "user_img";
      userImg.loading = "lazy";
      userImg.alt = user.displayName;

      const userName = document.createElement("span");
      userName.className = "user_name";
      userName.textContent = user.displayName;

      const uid = document.createElement("span");
      uid.className = "user_id";
      uid.textContent = user.id;
      uid.style.display = "none";

      const userEmail = document.createElement("span");
      userEmail.className = "user_email";
      userEmail.textContent = user.email;
      userEmail.style.display = "none";

      const userJoined = document.createElement("span");
      userJoined.className = "user_joined";
      userJoined.textContent = user.creationTime;
      userJoined.style.display = "none";

      const userLastSeen = document.createElement("span");
      userLastSeen.className = "user_lastseen";
      userLastSeen.textContent = user.lastSignInTime;
      userLastSeen.style.display = "none";

      userItem.append(userImg, userName);
      userPlaceholder.appendChild(userItem);
      ui.initScrollReveal();
    });
  }
}

async function loadUserData(callback) {
  const users = await firebase.getData("users");

  if (typeof callback === "function") {
    callback(users);
  }

  if (document.getElementById("user_placeholder")) {
    displayUsers(users);
  }
}

function logUsers(users) {
  console.log("User loaded :", users);
}

export { loadUserData, logUsers };
