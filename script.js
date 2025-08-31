// Project Items
const ITEMS = [
  {
    id: '3d_01',
    title: '3D Work Sample',
    category: '3D Art',
    type: 'image',
    thumb: 'https://via.placeholder.com/400x300.png?text=3D+Art',
    folder: 'https://drive.google.com/drive/folders/XXXX'
  },
  {
    id: 'logo_01',
    title: 'Logo Design',
    category: 'Logo',
    type: 'image',
    thumb: 'https://via.placeholder.com/400x300.png?text=Logo',
    folder: 'https://drive.google.com/drive/folders/YYYY'
  },
  {
    id: 'video_01',
    title: 'Video Editing',
    category: 'Video Editing',
    type: 'video',
    thumb: 'https://www.w3schools.com/html/mov_bbb.mp4',
    folder: 'https://drive.google.com/drive/folders/ZZZZ'
  }
];

const grid = document.getElementById("workGrid");
const modal = document.getElementById("previewModal");
const previewContainer = document.getElementById("previewContainer");
const driveLink = document.getElementById("driveLink");
const closeBtn = document.querySelector(".close");

// Render Cards
function renderCards(filter = "all") {
  grid.innerHTML = "";
  ITEMS.filter(item => filter === "all" || item.category === filter)
       .forEach(item => {
    const card = document.createElement("div");
    card.className = "work-card";
    card.innerHTML = `
      ${item.type === "image"
        ? `<img src="${item.thumb}" alt="${item.title}">`
        : `<video src="${item.thumb}" muted></video>`}
      <h3>${item.title}</h3>
    `;
    card.onclick = () => openModal(item);
    grid.appendChild(card);
  });

  // Animate with GSAP
  gsap.from(".work-card", {
    opacity: 0,
    y: 40,
    duration: 0.6,
    stagger: 0.1
  });
}

// Modal
function openModal(item) {
  modal.style.display = "flex";
  previewContainer.innerHTML = item.type === "image"
    ? `<img src="${item.thumb}" alt="${item.title}">`
    : `<video src="${item.thumb}" controls autoplay></video>`;
  driveLink.href = item.folder;
}
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// Filters
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters button.active")?.classList.remove("active");
    btn.classList.add("active");
    renderCards(btn.dataset.filter);
  });
});

// Init
renderCards();
