// Basic hover interaction or future enhancements
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    });
  });
});
