const gallery = document.getElementById("galleryGrid");
const heroImage = document.getElementById("heroImage");
const heroTitle = document.getElementById("heroTitle");
const randomImage = document.getElementById("randomImage");
const randomTitle = document.getElementById("randomTitle");
const randomBtn = document.getElementById("randomBtn");
const heroRandom = document.getElementById("heroRandom");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const closeLightbox = document.getElementById("closeLightbox");

function buildGallery() {
  images.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.innerHTML = `
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <strong>${String(index + 1).padStart(2, "0")} — ${item.title}</strong>
    `;
    card.addEventListener("click", () => openLightbox(item));
    gallery.appendChild(card);
  });
}

function randomCemo() {
  const item = images[Math.floor(Math.random() * images.length)];
  randomImage.src = item.src;
  randomTitle.textContent = item.title;
  heroImage.src = item.src;
  heroTitle.textContent = item.title;
}

function openLightbox(item) {
  lightboxImage.src = item.src;
  lightboxTitle.textContent = item.title;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeBox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

randomBtn.addEventListener("click", randomCemo);
heroRandom.addEventListener("click", randomCemo);
closeLightbox.addEventListener("click", closeBox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeBox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBox();
});

buildGallery();
