import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

async function loadHeader() {
  try {
    const res = await fetch("./ui/header.html");
    document.getElementById("header").innerHTML = await res.text();
  } catch (err) {
    console.error("❌ Failed to load header:", err);
  }
}

async function loadNav() {
  try {
    const res = await fetch("./ui/sidebar.html");
    document.getElementById("sidebar").innerHTML = await res.text();
  } catch (err) {
    console.error("❌ Failed to load nav:", err);
  }
}

async function loadFooter() {
  try {
    const res = await fetch("./ui/footer.html");
    document.getElementById("footer").innerHTML = await res.text();
  } catch (err) {
    console.error("❌ Failed to load footer:", err);
  }
}

async function initIcon() {
  const ionicons = document.createElement("script");
  ionicons.type = "module";
  ionicons.src =
    "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
  document.head.appendChild(ionicons);
}

function loadScrollRevealScript() {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src*="scrollreveal"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", resolve);
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/scrollreveal";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Gagal memuat ScrollReveal."));
    document.head.appendChild(script);
  });
}

async function initScrollReveal() {
  if (typeof ScrollReveal === "undefined") {
    await loadScrollRevealScript();
  }
  
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

export {
  loadHeader,
  loadNav,
  loadFooter,
  initIcon,
  initScrollReveal,
  initFavicon,
  initQuill,
  initSwiper,
  initTypewriter,
  initScaler,
  handleActiveLink,
  handleActivePage,
};
