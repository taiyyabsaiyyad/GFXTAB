// Portfolio items (Google Drive links converted!)
const ITEMS = [
  {
    id: '3d_01',
    title: '3D Work Sample',
    category: '3D Art',
    type: 'image',
    thumb: 'https://drive.google.com/uc?export=view&id=1AbCdEfGhIjKlMnOpQ',
    folder: 'https://drive.google.com/drive/folders/XXXX'
  },
  {
    id: 'logo_01',
    title: 'Logo Design',
    category: 'Logo',
    type: 'image',
    thumb: 'https://drive.google.com/uc?export=view&id=1XyZ9876LMNOPQRST',
    folder: 'https://drive.google.com/drive/folders/YYYY'
  },
  {
    id: 'video_01',
    title: 'Video Editing',
    category: 'Video Editing',
    type: 'video',
    thumb: 'https://drive.google.com/uc?export=view&id=1ZZZ1234ABCDE5678',
    folder: 'https://drive.google.com/drive/folders/ZZZZ'
  }
];

// Render cards
const portfolio = document.getElementById("portfolio");
function renderItems(filter) {
  portfolio.innerHTML = "";
  ITEMS.filter(item => filter === "all" || item.category === filter)
       .forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = item.type === "image"
      ? `<img src="${item.thumb}" alt="${item.title}">`
      : `<video src="${item.thumb}" controls></video>`;
    card.onclick = () => openModal(item);
    portfolio.appendChild(card);
  });
}

// Filter buttons
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    renderItems(btn.dataset.filter);
  });
});

// Modal
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const openDrive = document.getElementById("openDrive");
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");

function openModal(item) {
  modalBody.innerHTML = item.type === "image"
    ? `<img src="${item.thumb}" style="max-width:100%;">`
    : `<video src="${item.thumb}" controls autoplay style="max-width:100%;">`;
  openDrive.href = item.folder;
  modal.classList.remove("hidden");
}

// Load all by default
renderItems("all");
