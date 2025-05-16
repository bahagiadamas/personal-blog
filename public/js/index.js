import * as firebase from "./modules/firebase.js";
import * as ui from "./modules/ui.js";
import * as project from "./modules/project.js";
import * as int from "./modules/interaction.js";

async function initializeApp() {
  try {
    firebase.logEvent(firebase.analytics, "page_view");
    ui.initIcon();
    ui.initFavicon();
    ui.initScrollReveal();

    // BACKGROUND SCALER
    if (document.querySelector("section#hero")) {
      ui.initScaler("section#hero .container", ".hero-text");
    }
    // HEADER INIT
    if (document.getElementById("header")) {
      await ui.loadHeader();
      document
        .getElementById("toggleNavbar")
        .addEventListener("click", int.toggleNavbar);

      document.querySelectorAll(".menu-overlay").forEach((overlay) => {
        overlay.addEventListener("click", int.closeNavbar);
      });
      if (
        document.getElementById("navbar") &&
        document.querySelectorAll("section").length > 0
      ) {
        ui.handleActiveLink();
      }
      int.themeToggler();
    }
    // SIDEBAR INIT
    if (document.getElementById("sidebar")) {
      await ui.loadNav();

      document
        .getElementById("toggleSidebar")
        .addEventListener("click", int.toggleSidebar);

      document
        .querySelector(".sidebar-overlay")
        .addEventListener("click", int.closeSidebar);

      document.querySelectorAll(".dropdown-btn").forEach((div) => {
        div.addEventListener("click", () => int.toggleSubmenu(div));
      });
      int.themeToggler();
    }
    // FOOTER INIT
    if (document.getElementById("footer")) {
      await ui.loadFooter();
    }
    // LOAD DATA
    await project.loadProjectData();
    // LOAD DETAIL
    if (document.getElementById("detail-wrapper")) {
      project.fetchProjectDetail();
    }
    // QUILL INIT
    if (document.querySelector("#editor-container")) {
      ui.initQuill();
    }
    // TYPEWRITER
    if (document.querySelector(".typewriter-text")) {
      ui.initTypewriter();
    }
    // FORM
    if (document.getElementById("myForm")) {
      int.initFormSubmission();
    }

    console.log("App Initialized");
  } catch (error) {
    console.error("Error Initializing App:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);

window.showPopup = int.showPopup;
window.closePopup = int.closePopup;
