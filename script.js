document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const overlay = document.getElementById("overlay");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    navLinks.classList.remove("show");
    overlay.classList.remove("active");
  });
});
