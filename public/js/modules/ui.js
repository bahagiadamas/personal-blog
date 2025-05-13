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

export { loadHeader, loadNav, loadFooter };
