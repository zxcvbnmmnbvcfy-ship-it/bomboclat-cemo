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
const searchInput = document.getElementById("searchInput");
const photoInput = document.getElementById("photoInput");
const userGallery = document.getElementById("userGallery");
const clearUploads = document.getElementById("clearUploads");
const downloadGallery = document.getElementById("downloadGallery");
const loader = document.getElementById("loader");
const cursorGlow = document.getElementById("cursorGlow");
const matrixCanvas = document.getElementById("matrixCanvas");
const favoritesGrid = document.getElementById("favoritesGrid");
const quoteText = document.getElementById("quoteText");
const quoteBtn = document.getElementById("quoteBtn");
const visitCount = document.getElementById("visitCount");
const dailyImage = document.getElementById("dailyImage");
const dailyTitle = document.getElementById("dailyTitle");
const slideshowBtn = document.getElementById("slideshowBtn");
const musicPlayer = document.getElementById("musicPlayer");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");
const siteMusic = document.getElementById("siteMusic");

const cemoQuotes = [
  "Ben gidiyorum buralardan yalatmak isteyen var mı",
  "Cemo gelirse sanayi susar.",
  "Sarımsağı cebine koyan kral gibi gezer.",
  "Usta işi poz, sanayi işi karizma.",
  "Bomboclat modu açıldı.",
  "Cemo bakarsa galeri titrer.",
  "Parça depoda, karizma tavanda.",
  "Bugün de kralız, yarın da kralız.",
  "Sanayinin Wi-Fi şifresi: CEMO."
];

let currentGalleryList = images;
let slideshowTimer = null;

function openLightbox(item) {
  if (!lightbox || !lightboxImage || !lightboxTitle) return;
  lightboxImage.src = item.src;
  lightboxTitle.textContent = item.title;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeBox() {
  if (!lightbox) return;
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

function randomCemo() {
  if (!images.length) return;
  const item = images[Math.floor(Math.random() * images.length)];
  if (randomImage) randomImage.src = item.src;
  if (randomTitle) randomTitle.textContent = item.title;
  if (heroImage) heroImage.src = item.src;
  if (heroTitle) heroTitle.textContent = item.title;
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("cemoFavorites") || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem("cemoFavorites", JSON.stringify(list));
}

function isFavorite(src) {
  return getFavorites().some(item => item.src === src);
}

function toggleFavorite(item) {
  let favs = getFavorites();
  if (favs.some(f => f.src === item.src)) {
    favs = favs.filter(f => f.src !== item.src);
  } else {
    favs.push(item);
  }
  saveFavorites(favs);
  rebuildGallery(currentGalleryList);
  renderFavorites();
}

function rebuildGallery(list = images) {
  if (!gallery) return;
  currentGalleryList = list;
  gallery.innerHTML = "";

  list.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.innerHTML = `
      <a class="download-btn" href="${item.src}" download>İndir</a>
      <button class="like-btn ${isFavorite(item.src) ? "active" : ""}" type="button">❤</button>
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <strong>${String(index + 1).padStart(2, "0")} — ${item.title}</strong>
    `;

    const img = card.querySelector("img");
    const strong = card.querySelector("strong");
    const like = card.querySelector(".like-btn");

    if (img) img.addEventListener("click", () => openLightbox(item));
    if (strong) strong.addEventListener("click", () => openLightbox(item));
    if (like) like.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(item);
    });

    gallery.appendChild(card);
  });
}

function renderFavorites() {
  if (!favoritesGrid) return;
  const favs = getFavorites();
  favoritesGrid.innerHTML = "";

  if (!favs.length) {
    favoritesGrid.innerHTML = "<p style='color:rgba(255,255,255,.65);line-height:1.6'>Henüz favori eklenmedi.</p>";
    return;
  }

  favs.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.innerHTML = `
      <button class="like-btn active" type="button">❤</button>
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <strong>${String(index + 1).padStart(2, "0")} — ${item.title}</strong>
    `;

    const img = card.querySelector("img");
    const like = card.querySelector(".like-btn");

    if (img) img.addEventListener("click", () => openLightbox(item));
    if (like) like.addEventListener("click", () => toggleFavorite(item));

    favoritesGrid.appendChild(card);
  });
}

function getUserPhotos() {
  try {
    return JSON.parse(localStorage.getItem("cemoUserPhotos") || "[]");
  } catch {
    return [];
  }
}

function saveUserPhotos(list) {
  localStorage.setItem("cemoUserPhotos", JSON.stringify(list));
}

function renderUserPhotos() {
  if (!userGallery) return;
  const list = getUserPhotos();
  userGallery.innerHTML = "";

  if (!list.length) {
    userGallery.innerHTML = "<p style='color:rgba(255,255,255,.65);line-height:1.6'>Henüz kullanıcı fotoğrafı eklenmedi.</p>";
    return;
  }

  list.forEach((item) => {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.title;
    img.addEventListener("click", () => openLightbox(item));
    userGallery.appendChild(img);
  });
}

function setDailyCemo() {
  if (!dailyImage || !dailyTitle || !images.length) return;
  const dayKey = new Date().toISOString().slice(0, 10);
  let total = 0;
  for (const ch of dayKey) total += ch.charCodeAt(0);
  const item = images[total % images.length];
  dailyImage.src = item.src;
  dailyTitle.textContent = item.title;
}

function newQuote() {
  if (!quoteText) return;
  quoteText.textContent = cemoQuotes[Math.floor(Math.random() * cemoQuotes.length)];
}

function updateVisits() {
  if (!visitCount) return;
  const count = Number(localStorage.getItem("cemoVisits") || "0") + 1;
  localStorage.setItem("cemoVisits", String(count));
  visitCount.textContent = count;
}

function toggleSlideshow() {
  if (!slideshowBtn) return;

  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    slideshowBtn.textContent = "Slayt Başlat";
    return;
  }

  slideshowBtn.textContent = "Slayt Durdur";
  slideshowTimer = setInterval(randomCemo, 1800);
}

function setupMusic() {
  if (!musicToggle || !siteMusic || !musicPlayer || !musicStatus) return;

  function update(isPlaying) {
    musicPlayer.classList.toggle("playing", isPlaying);
    document.body.classList.toggle("music-on", isPlaying);
    musicToggle.textContent = isPlaying ? "Ⅱ" : "▶";
    musicStatus.textContent = isPlaying ? "Çalıyor" : "Başlatmak için tıkla";
  }

  async function play() {
    try {
      await siteMusic.play();
      update(true);
    } catch {
      musicStatus.textContent = "Tarayıcı engelledi, tıkla";
      update(false);
    }
  }

  musicToggle.addEventListener("click", () => {
    if (siteMusic.paused) play();
    else {
      siteMusic.pause();
      update(false);
    }
  });

  play();
}

function setupCursorGlow() {
  if (!cursorGlow) return;
  window.addEventListener("pointermove", (e) => {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
  });
}

function setupMatrix() {
  if (!matrixCanvas) return;
  const ctx = matrixCanvas.getContext("2d");
  let w, h, cols, drops;
  const chars = "BOMBOCLATCEMO0123456789";

  function resize() {
    w = matrixCanvas.width = window.innerWidth;
    h = matrixCanvas.height = window.innerHeight;
    cols = Math.floor(w / 18);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ffe24a";
    ctx.font = "16px monospace";

    for (let i = 0; i < drops.length; i++) {
      const t = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(t, i * 18, drops[i] * 18);
      if (drops[i] * 18 > h && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener("resize", resize);
  setInterval(draw, 70);
}

if (randomBtn) randomBtn.addEventListener("click", randomCemo);
if (heroRandom) heroRandom.addEventListener("click", randomCemo);
if (closeLightbox) closeLightbox.addEventListener("click", closeBox);
if (lightbox) lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeBox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBox();
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    rebuildGallery(images.filter(item => item.title.toLowerCase().includes(q)));
  });
}

if (photoInput) {
  photoInput.addEventListener("change", async (event) => {
    const files = [...event.target.files].filter(file => file.type.startsWith("image/"));
    const current = getUserPhotos();

    for (const file of files) {
      const src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      current.push({
        src,
        title: "Kullanıcı Cemo Fotoğrafı"
      });
    }

    saveUserPhotos(current);
    renderUserPhotos();
    event.target.value = "";
  });
}

if (clearUploads) {
  clearUploads.addEventListener("click", () => {
    localStorage.removeItem("cemoUserPhotos");
    renderUserPhotos();
  });
}

if (downloadGallery) {
  downloadGallery.addEventListener("click", () => {
    const data = JSON.stringify(getUserPhotos(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cemo-kullanici-galerisi.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

if (quoteBtn) quoteBtn.addEventListener("click", newQuote);
if (slideshowBtn) slideshowBtn.addEventListener("click", toggleSlideshow);

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("hide"), 950);
});

setupCursorGlow();
setupMatrix();
setupMusic();
setDailyCemo();
newQuote();
updateVisits();
rebuildGallery(images);
renderFavorites();
renderUserPhotos();
