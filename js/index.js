import { loadHeader, loadNav, loadFooter } from "./modules/ui.js";
import {
  toggleNavbar,
  closeNavbar,
  toggleSidebar,
  closeSidebar,
  toggleSubmenu,
  themeToggler,
  handleActiveLink,
  handleActivePage,
  initScaler,
} from "./modules/interaction.js";
import { db, analytics, logEvent } from "./modules/database.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

async function initIcon() {
  const ionicons = document.createElement("script");
  ionicons.type = "module";
  ionicons.src =
    "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
  document.head.appendChild(ionicons);
}

async function initScrollReveal() {
  const popups = document.querySelectorAll(".popup");
  const parents = [...new Set([...popups].map((el) => el.parentElement))];

  parents.forEach((parent) => {
    const elements = parent.querySelectorAll(".popup");

    elements.forEach((el, index) => {
      let revealConfig = {
        scale: 0.9,
        opacity: 0,
        duration: 1200,
        delay: 100 + index * 50,
        reset: true,
      };

      if (el.classList.contains("popup-left")) {
        revealConfig.origin = "left";
        revealConfig.distance = "40px";
      } else if (el.classList.contains("popup-right")) {
        revealConfig.origin = "right";
        revealConfig.distance = "40px";
      } else if (el.classList.contains("popup-up")) {
        revealConfig.origin = "bottom";
        revealConfig.distance = "40px";
      } else if (el.classList.contains("popup-down")) {
        revealConfig.origin = "top";
        revealConfig.distance = "40px";
      } else if (el.classList.contains("popup-fade")) {
        revealConfig = {
          opacity: 0,
          duration: 1200,
          delay: 100 + index * 50,
          reset: false,
        };
      }

      ScrollReveal().reveal(el, revealConfig);
    });
  });
}

function initFavicon() {
  const faviconUrl = "assets/img/logo.png";

  let favicon = document.querySelector("link[rel~='icon']");

  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }

  favicon.href = faviconUrl;
}

function initQuill() {
  new Quill("#editor-container", {
    theme: "snow",
  });
}

async function initSwiper() {
  new Swiper(".carousel-wrapper", {
    loop: true,
    speed: 2000,
    spaceBetween: 20,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}

async function initTypewriter() {
  const texts = [
    "Empowering Communities",
    "Driving Innovation",
    "Bridging Technology",
    "Sustainable Solutions",
    "Optimizing Impact",
    "Transforming Industries",
    "Fostering Growth",
  ];
  const speed = 100;
  const eraseSpeed = 50;
  const delayBeforeErase = 3000;
  const textElement = document.querySelector(".typewriter-text");

  let textIndex = 0;
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < texts[textIndex].length) {
      textElement.innerHTML = texts[textIndex].substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeWriter, speed);
    } else {
      setTimeout(eraseText, delayBeforeErase);
    }
  }

  function eraseText() {
    if (charIndex > 0) {
      textElement.innerHTML = texts[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseText, eraseSpeed);
    } else {
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, speed);
    }
  }

  if (textElement) {
    typeWriter();
  }
}

function initFormSubmission() {
  const form = document.getElementById("myForm");
  if (!form) return;

  const actionURL =
    "https://docs.google.com/forms/d/e/1FAIpQLSeSokqRoSC_3ohmiSDAoJR60k6gHRli2WwI9EHfF3gyAJ_51A/formResponse";

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    fetch(actionURL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        form.reset();
        showPopup();
      })
      .catch(() => {});
  });
}

function showPopup() {
  const popup = document.getElementById("form-message");
  if (popup) {
    popup.classList.add("open");
  }
}

function closePopup() {
  const popupElement = document.getElementById("form-message");
  if (popupElement) {
    popupElement.classList.remove("open");
  }
}

window.closePopup = closePopup;

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
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadProjectData() {
  const projects = await getData("projects");

  if (document.getElementById("featurePlaceholder")) {
    displayFeature(projects);
  }
  if (document.getElementById("navPlaceholder")) {
    displayNav(projects);
  }
  if (document.getElementById("project-wrapper")) {
    displayProjects(projects);
  }

  if (document.querySelector(".swiper")) {
    initSwiper();
  }
}

// HOME FEATURE
function displayFeature(projects) {
  const featurePlaceholder = document.getElementById("featurePlaceholder");

  if (featurePlaceholder) {
    featurePlaceholder.innerHTML = "";

    projects.forEach((project) => {
      const projectItem = document.createElement("div");
      projectItem.className = "swiper-slide";
      projectItem.dataset.projectId = project.id;

      projectItem.addEventListener("click", () => {
        window.location.href = `project-detail.html?id=${project.id}`;
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
// NAVIGATION
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
        linkItem.href = `project-detail.html?id=${project.id}`;
        linkItem.className = "nav-project-title";
        linkItem.textContent = project.title;
        listItem.appendChild(linkItem);

        if (submenuDiv) {
          submenuDiv.appendChild(listItem);
        }
        handleActivePage();
      });
    } catch (error) {
      console.error("Failed to fetch project: ", error);
    }
  } else {
    console.error("Placeholder not found.");
  }
}
// PROJECT LIST
function displayProjects(projects) {
  const projectPlaceholder = document.getElementById("project-wrapper");

  if (projectPlaceholder) {
    projectPlaceholder.innerHTML = "";

    projects.forEach((project) => {
      const projectItem = document.createElement("div");
      projectItem.className = "project-item popup";
      projectItem.dataset.projectId = project.id;

      projectItem.addEventListener("click", () => {
        window.location.href = `project-detail.html?id=${project.id}`;
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

      projectPlaceholder.appendChild(projectItem);

      initScrollReveal();
    });
  } else {
    console.error('Element with ID "projectPlaceholder" not found.');
  }
}
// PROJECT DETAIL
async function fetchProjectDetail() {
  const proejctId = getProjectId();
  const projectPlaceholder = document.getElementById("detail-wrapper");

  if (!proejctId) {
    console.error("Project ID is missing!");
    projectPlaceholder.innerHTML =
      "<p class='error-message'>Project not found.</p>";
    return;
  }

  try {
    const projectRef = doc(db, "projects", proejctId);
    const projectSnap = await getDoc(projectRef);

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
    initScrollReveal();
    initScaler("section#project-detail .banner-wrapper", ".project-title");
  } else {
    console.error("Placeholder not found.");
  }
}

async function initializeApp() {
  try {
    logEvent(analytics, "page_view");
    initIcon();
    initFavicon();
    initScrollReveal();

    // BACKGROUND SCALER
    if (document.querySelector("section#hero")) {
      initScaler("section#hero .container", ".hero-text");
    }

    // HEADER INIT
    if (document.getElementById("header")) {
      await loadHeader();
      document
        .getElementById("toggleNavbar")
        .addEventListener("click", toggleNavbar);

      document.querySelectorAll(".menu-overlay").forEach((overlay) => {
        overlay.addEventListener("click", closeNavbar);
      });
      if (
        document.getElementById("navbar") &&
        document.querySelectorAll("section").length > 0
      ) {
        handleActiveLink();
      }
      themeToggler();
    }
    // SIDEBAR INIT
    if (document.getElementById("sidebar")) {
      await loadNav();
      
      document
        .getElementById("toggleSidebar")
        .addEventListener("click", toggleSidebar);

      document
        .querySelector(".sidebar-overlay")
        .addEventListener("click", closeSidebar);

      document.querySelectorAll(".dropdown-btn").forEach((div) => {
        div.addEventListener("click", () => toggleSubmenu(div));
      });
      themeToggler();
    }
    // FOOTER INIT
    if (document.getElementById("footer")) {
      await loadFooter();
    }
    // LOAD DATA
    await loadProjectData();
    // LOAD DETAIL
    if (document.getElementById("detail-wrapper")) {
      fetchProjectDetail();
    }
    // QUILL INIT
    if (document.querySelector("#editor-container")) {
      initQuill();
    }
    // TYPEWRITER
    if (document.querySelector(".typewriter-text")) {
      initTypewriter();
    }
    // FORM
    if (document.getElementById("myForm")) {
      initFormSubmission();
    }

    console.log("App Initialized");
  } catch (error) {
    console.error("Error Initializing App:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
