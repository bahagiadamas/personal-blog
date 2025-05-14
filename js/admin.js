import { db, auth } from "./modules/database.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { signInWithGoogle, logoutAdmin } from "./auth.js";

let quillEdit;

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

function displayProjects(projects) {
  const listPlaceholder = document.getElementById("list-placeholder");

  if (listPlaceholder) {
    listPlaceholder.innerHTML = "";
    projects.forEach((project) => {
      const projectItem = document.createElement("tr");
      projectItem.dataset.projectId = project.id;

      const projectTitle = document.createElement("td");
      projectTitle.className = "project_title";
      projectTitle.textContent = project.title;
      projectTitle.style.cursor = "pointer";
      projectTitle.addEventListener("click", () => {
        window.location.href = `project-detail.html?id=${project.id}`;
      });

      const projectDescriptionCell = document.createElement("td");
      projectDescriptionCell.className = "project_description";
      projectDescriptionCell.textContent = project.description || "";
      projectDescriptionCell.style.display = "none";

      const actionButton = document.createElement("td");
      actionButton.className = "action_button";

      const editBtn = document.createElement("span");
      editBtn.className = "edit-btn";
      editBtn.innerHTML = '<ion-icon name="pencil-outline"></ion-icon>';
      editBtn.addEventListener("click", editItem);

      const deleteBtn = document.createElement("span");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
      deleteBtn.addEventListener("click", () => deleteProject(project.id));

      actionButton.append(editBtn, deleteBtn);
      projectItem.append(projectTitle, projectDescriptionCell, actionButton);
      listPlaceholder.appendChild(projectItem);
    });
  } else {
    console.error("Placeholder not found");
  }
}

async function loadProject() {
  const projects = await getData("projects");
  displayProjects(projects);
}

function addItem() {
  window.location.href = "new-project.html";
}

function editItem(event) {
  const btn = event.target.closest(".edit-btn");
  const projectRow = btn?.closest("tr");

  if (projectRow) {
    const projectId =
      projectRow.dataset.projectId ||
      projectRow.querySelector(".project_id")?.textContent;

    if (projectId) {
      window.location.href = `edit-project.html?id=${projectId}`;
    } else {
      console.error("ID proyek tidak ditemukan pada baris tabel.");
    }
  } else {
    console.error("Tombol edit tidak ditemukan.");
  }
}

async function deleteProject(projectId) {
  if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      console.log(`Project with ID ${projectId} deleted successfully!`);
      loadProject();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Gagal menghapus proyek.");
    }
  }
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
      loginGoogleBtn.addEventListener("click", signInWithGoogle);
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
    console.log("Tidak ada pengguna yang login.");
  } else {
    if (loginGoogleBtn) {
      loginGoogleBtn.style.display = "none";
    }
    if (logoutGoogleBtn) {
      logoutGoogleBtn.style.display = "flex";
      logoutGoogleBtn.addEventListener("click", logoutAdmin);
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
      loadProject();
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
    console.log("Pengguna login dengan UID:", user.uid);
  }
}

async function adminInit() {
  auth.onAuthStateChanged(handleAuthState);
}

document.addEventListener("DOMContentLoaded", adminInit);
