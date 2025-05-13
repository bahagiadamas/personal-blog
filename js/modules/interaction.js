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

function handleActiveLink() {
  const navLinks = document.querySelectorAll("#navbar a");
  const sections = document.querySelectorAll("section");

  function updateActiveLink() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();
}

function handleActivePage() {
  const navLinks = document.querySelectorAll("#navPlaceholder a");
  const currentPage = window.location.href;

  navLinks.forEach((link) => {
    if (link.href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function initScaler(targetSelector, childSelector = null, customStyles = {}) {
  const targetElement = document.querySelector(targetSelector);
  const childElement = childSelector
    ? targetElement?.querySelector(childSelector)
    : null;

  const originalChildTransform = childElement
    ? window.getComputedStyle(childElement).transform
    : null;

  if (targetElement) {
    function scaleBackground() {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scaleFactor = 1 + scrollY / 2000;
        const maxScale = 1.25;
        const currentScale = Math.min(scaleFactor, maxScale);
        const blurRadius = Math.max(1, Math.min(scrollY / 40, 8));

        targetElement.style.transform = `scale(${currentScale})`;
        targetElement.style.transformOrigin = "center center";
        targetElement.style.setProperty(
          "--backdrop-blur-radius",
          `${blurRadius}px`
        );

        if (childElement) {
          const invertScale = 1 / currentScale;

          let baseTransform =
            originalChildTransform && originalChildTransform !== "none"
              ? originalChildTransform
              : "";

          if (customStyles.transform) {
            baseTransform = customStyles.transform;
          }

          const finalTransform = `${baseTransform} scale(${invertScale})`;
          childElement.style.transform = finalTransform;
          childElement.style.transformOrigin = "center center";

          Object.keys(customStyles).forEach((styleProp) => {
            if (styleProp !== "transform") {
              childElement.style[styleProp] = customStyles[styleProp];
            }
          });
        }
      });
    }

    scaleBackground();
    window.addEventListener("scroll", scaleBackground);
  }
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
  handleActiveLink,
  handleActivePage,
  initScaler,
};
