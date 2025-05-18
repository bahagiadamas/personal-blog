import * as firebase from "./firebase.js";
import * as ui from "./ui.js";

function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function displayFeature(projects) {
  const featurePlaceholder = document.getElementById("featurePlaceholder");

  if (featurePlaceholder) {
    featurePlaceholder.innerHTML = "";

    projects.forEach((project) => {
      const projectItem = document.createElement("div");
      projectItem.className = "swiper-slide";
      projectItem.dataset.projectId = project.id;

      projectItem.addEventListener("click", () => {
        window.location.href = `project.html?id=${project.id}`;
      });

      const imgWrapper = document.createElement("div");
      imgWrapper.className = "img-wrapper";

      const imgElement = document.createElement("img");
      imgElement.src = project.imgUrl;
      imgElement.alt = project.title;
      imgElement.loading = "lazy";

      imgWrapper.appendChild(imgElement);

      const titleElement = document.createElement("h4");
      titleElement.className = "project-title";
      titleElement.textContent = project.title;

      projectItem.appendChild(imgWrapper);
      projectItem.appendChild(titleElement);

      featurePlaceholder.appendChild(projectItem);
    });
  } else {
    console.error("Placeholder not found.");
  }
}

function displayNav(projects) {
  const navPlaceholder = document.getElementById("navPlaceholder");
  if (navPlaceholder) {
    const submenuDiv = document.querySelector("#navPlaceholder > div");
    if (submenuDiv) {
      submenuDiv.innerHTML = "";
    }

    try {
      projects.forEach((project) => {
        const listItem = document.createElement("li");
        const linkItem = document.createElement("a");
        linkItem.href = `project.html?id=${project.id}`;
        linkItem.className = "nav-project-title";
        linkItem.textContent = project.title;
        listItem.appendChild(linkItem);

        if (submenuDiv) {
          submenuDiv.appendChild(listItem);
        }
        ui.handleActivePage();
      });
    } catch (error) {
      console.error("Failed to fetch project: ", error);
    }
  } else {
    console.error("Placeholder not found.");
  }
}

function displayProjects(projects, placeholderId) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  const notFoundEl = placeholder.querySelector(".not-found");

  placeholder.innerHTML = "";

  if (notFoundEl) {
    placeholder.appendChild(notFoundEl);
    notFoundEl.style.display = "none";
  }

  if (placeholder) {
    projects.forEach((project) => {
      if (placeholderId === "project-wrapper") {
        const projectItem = document.createElement("div");
        projectItem.className = "project-item popup";
        projectItem.dataset.projectId = project.id;
        projectItem.addEventListener("click", () => {
          window.location.href = `project.html?id=${project.id}`;
        });

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "img-wrapper";
        const imgElement = document.createElement("img");
        imgElement.src = project.imgUrl;
        imgElement.alt = project.title;
        imgElement.loading = "lazy";
        imgWrapper.appendChild(imgElement);

        const titleElement = document.createElement("h4");
        titleElement.className = "project-title";
        titleElement.textContent = project.title;

        projectItem.appendChild(imgWrapper);
        projectItem.appendChild(titleElement);
        placeholder.appendChild(projectItem);
      } else if (placeholderId === "project_placeholder") {
        const projectItem = document.createElement("div");
        projectItem.className = "collection-item project popup";
        projectItem.dataset.projectId = project.id;

        const projectTitle = document.createElement("span");
        projectTitle.className = "project_title";
        projectTitle.textContent = project.title;
        projectTitle.addEventListener("click", () => {
          window.location.href = `project.html?id=${project.id}`;
        });

        const projectDescriptionCell = document.createElement("td");
        projectDescriptionCell.className = "project_description";
        projectDescriptionCell.textContent = project.description || "";
        projectDescriptionCell.style.display = "none";

        const actionButton = document.createElement("span");
        actionButton.className = "action_button";

        const editBtn = document.createElement("ion-icon");
        editBtn.className = "edit-btn";
        editBtn.name = "pencil-outline";
        editBtn.addEventListener("click", editItem);

        const deleteBtn = document.createElement("ion-icon");
        deleteBtn.className = "delete-btn";
        deleteBtn.name = "trash-outline";
        deleteBtn.addEventListener("click", () => deleteProject(project.id));

        actionButton.append(editBtn, deleteBtn);
        projectItem.append(projectTitle, projectDescriptionCell, actionButton);
        placeholder.appendChild(projectItem);
      } else {
        console.error(`Placeholder with ID "${placeholderId}" tidak dikenali.`);
      }
    });
  } else {
    console.error(`Element with ID "${placeholderId}" not found.`);
  }
  
  ui.initScrollReveal();
}

function editItem(event) {
  const btn = event.target.closest(".edit-btn");
  const projectRow = btn?.closest(".collection-item");

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
      await firebase.deleteDoc(
        firebase.doc(firebase.db, "projects", projectId)
      );
      console.log(`Project with ID ${projectId} deleted successfully!`);
      loadProjectData();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Gagal menghapus proyek.");
    }
  }
}

async function fetchProjectDetail() {
  const projectId = getProjectId();
  const projectPlaceholder = document.getElementById("detail-wrapper");

  if (!projectId) {
    console.error("Project ID is missing!");
    projectPlaceholder.innerHTML =
      "<p class='error-message'>Project not found.</p>";
    return;
  }

  try {
    const projectRef = firebase.doc(firebase.db, "projects", projectId);
    const projectSnap = await firebase.getDoc(projectRef);

    if (projectSnap.exists()) {
      const projectData = projectSnap.data();
      displayProject(projectData);
    } else {
      console.error("Project not found in Database.");
      projectPlaceholder.innerHTML =
        "<p class='error-message'>Project not found.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch project details:", error);
    projectPlaceholder.innerHTML =
      "<p class='error-message'>Failed to load project details.</p>";
  }
}

function displayProject(project) {
  const projectPlaceholder = document.getElementById("detail-wrapper");
  const bannerWrapper = document.createElement("div");
  const container = document.createElement("div");
  const projectTitle = document.createElement("h1");
  const projectDesc = document.createElement("div");

  bannerWrapper.className = "banner-wrapper";
  bannerWrapper.style.backgroundImage = `url("${project.imgUrl}")`;
  bannerWrapper.style.backgroundSize = "cover";
  bannerWrapper.style.backgroundPosition = "center";
  bannerWrapper.style.backgroundRepeat = "no-repeat";
  bannerWrapper.style.backgroundAttachment = "fixed";

  container.className = "container";

  projectTitle.className = "project-title popup popup-fade";
  projectTitle.textContent = project.title;

  projectDesc.className = "project-desc";
  projectDesc.innerHTML = project.description;

  document.title = `${project.title} | D B I CIPTA`;

  bannerWrapper.appendChild(projectTitle);
  container.appendChild(projectDesc);

  if (projectPlaceholder) {
    projectPlaceholder.append(bannerWrapper, container);
    ui.initScrollReveal();
    ui.initScaler("section#project-detail .banner-wrapper", ".project-title");
  } else {
    console.error("Placeholder not found.");
  }
}

async function loadProjectData(callback) {
  const projects = await firebase.getData("projects", "createdAt");

  if (typeof callback === "function") {
    callback(projects);
  }

  if (document.getElementById("featurePlaceholder")) {
    displayFeature(projects);
  }
  if (document.getElementById("navPlaceholder")) {
    displayNav(projects);
  }
  if (document.getElementById("project-wrapper")) {
    displayProjects(projects, "project-wrapper");
  }
  if (document.getElementById("project_placeholder")) {
    displayProjects(projects, "project_placeholder");
  }

  if (document.querySelector(".swiper")) {
    ui.initSwiper();
  }
}

function logProjects(projects) {
  console.log("Data loaded :", projects);
}

export { fetchProjectDetail, loadProjectData, logProjects };
