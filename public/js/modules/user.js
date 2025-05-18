import * as firebase from "./firebase.js";
import * as ui from "./ui.js";

function getUserId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

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
        window.location.href = `user.html?id=${user.id}`;
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

async function fetchUserDetail() {
  const userId = getUserId();
  const placeholder = document.getElementById("user_detail_placeholder");

  if (!userId) {
    console.error("User ID is missing!");
    placeholder.innerHTML = "<p class='error-message'>User not found.</p>";
    return;
  }

  try {
    const userRef = firebase.doc(firebase.db, "users", userId);
    const userSnap = await firebase.getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      userData.id = userSnap.id;
      displayUser(userData);
    } else {
      console.error("User not found in Database.");
      placeholder.innerHTML = "<p class='error-message'>User not found.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch user details: ", error);
    placeholder.innerHTML =
      "<p class='error-message'>Failed to load user details.</p>";
  }
}

function displayUser(user) {
  const placeholder = document.getElementById("user_detail_placeholder");
  const heading = document.createElement("div");
  heading.className = "heading";

  const userImg = document.createElement("img");
  userImg.className = "user-img";
  userImg.src = user.photoURL;
  userImg.alt = user.displayName;
  userImg.loading = "lazy";

  const userName = document.createElement("h3");
  userName.textContent = user.displayName;

  heading.append(userImg, userName);

  const detailWrapper = document.createElement("div");
  detailWrapper.className = "user-detail body";

  const groupUid = document.createElement("div");
  groupUid.className = "detail-group uid";

  const uidTitle = document.createElement("h4");
  uidTitle.className = "detail-title";
  uidTitle.textContent = "UID";

  const userId = document.createElement("p");
  userId.textContent = user.id;

  groupUid.append(uidTitle, userId);

  const groupEmail = document.createElement("div");
  groupEmail.className = "detail-group email";

  const emailTitle = document.createElement("h4");
  emailTitle.className = "detail-title";
  emailTitle.textContent = "Email";

  const userEmail = document.createElement("p");
  userEmail.textContent = user.email;
  groupEmail.append(emailTitle, userEmail);

  const groupJoined = document.createElement("div");
  groupJoined.className = "detail-group joined";

  const joinedTitle = document.createElement("h4");
  joinedTitle.className = "detail-title";
  joinedTitle.textContent = "Joined";

  const userJoined = document.createElement("p");
  userJoined.textContent = user.creationTime;

  groupJoined.append(joinedTitle, userJoined);

  const groupLastseen = document.createElement("div");
  groupLastseen.className = "detail-group lastseen";

  const lastseenTitle = document.createElement("h4");
  lastseenTitle.className = "detail-title";
  lastseenTitle.textContent = "Last Seen";

  const userLastseen = document.createElement("p");
  userLastseen.textContent = user.lastSignInTime;

  groupLastseen.append(lastseenTitle, userLastseen);

  detailWrapper.append(groupUid, groupEmail, groupJoined, groupLastseen);

  placeholder.append(heading, detailWrapper);

  document.title = `${user.displayName} | User`;
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

export { fetchUserDetail, loadUserData, logUsers };
