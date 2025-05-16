function toggleNavbar() {
  const navBar = document.getElementById("navbar");
  navBar.classList.toggle("open");
}

function closeNavbar() {
  const navBar = document.getElementById("navbar");
  const menuOverlay = document.querySelectorAll(".menu-overlay");
  navBar.classList.remove("open");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
  if (!sidebar.classList.contains("open")) {
    document.querySelectorAll(".sub-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
    document.querySelectorAll(".dropdown-btn").forEach((btn) => {
      btn.classList.remove("rotate");
    });
  }
}

function closeSidebar() {
  sidebar.classList.remove("open");
}

function toggleSubmenu(div) {
  document.querySelectorAll(".sub-menu").forEach((menu) => {
    if (menu !== div.nextElementSibling) {
      menu.classList.remove("show");
    }
  });

  document.querySelectorAll(".dropdown-btn").forEach((btn) => {
    if (btn !== div) {
      btn.classList.remove("rotate");
    }
  });

  div.nextElementSibling.classList.toggle("show");
  div.classList.toggle("rotate");

  if (!sidebar.classList.contains("open")) {
    sidebar.classList.toggle("open");
  }
}

function openForm() {
  const modalForm = document.getElementById("modalForm");
  modalForm.classList.add("open");
}

function closeForm() {
  const modalForm = document.getElementById("modalForm");
  modalForm.classList.remove("open");
}

function themeToggler() {
  const toggle = document.getElementById("toggleTheme");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle.addEventListener("change", function () {
    if (this.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });
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

function initSearch(inputId, placeholderId, itemSelector, textSelector) {
  const input = document.getElementById(inputId);
  const placeholder = document.getElementById(placeholderId);

  if (!input || !placeholder) return;

  const notFoundEl = placeholder.querySelector(".not-found");

  input.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const items = placeholder.querySelectorAll(itemSelector);
    let matchCount = 0;

    items.forEach((item) => {
      const text =
        item.querySelector(textSelector)?.textContent.toLowerCase() || "";
      const isMatch = text.includes(searchTerm);

      item.style.display = isMatch ? "flex" : "none";
      if (isMatch) matchCount++;
    });

    if (notFoundEl) {
      notFoundEl.textContent = "No Match Found.";
      notFoundEl.style.display = matchCount === 0 ? "block" : "none";
    }
  });
}

export {
  toggleNavbar,
  closeNavbar,
  toggleSidebar,
  closeSidebar,
  toggleSubmenu,
  openForm,
  closeForm,
  themeToggler,
  initFormSubmission,
  showPopup,
  closePopup,
  initSearch,
};
