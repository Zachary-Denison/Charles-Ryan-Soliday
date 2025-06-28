const photoItems = [
];

const videoItems = [
  {
    src: "media/,eeeeow.mp4",
    alt: "Meowing Party",
    download: "eeeeow.mp4",
    tags: ["gaming", "funny", "stupid"]
  },
  {
    src: "media/Team Fortress 2 2022.11.10 - 21.35.45.06.DVR.mp4",
    alt: "Free Nitro?",
    download: "TF2 Funny1",
    tags: ["gaming", "funny"]
  }
  {
    src: "media/Team Fortress 2 2022.09.03 - 01.00.01.15.DVR.mp4",
    alt: "Meow2?",
    download: "Meow2?",
    tags: ["gaming", "funny", "stupid"]
 
  }
];

const quotes = [
];

const memoryWall = [
];


function uniqueTags(items) {
  return Array.from(new Set(items.flatMap(item => item.tags || []))).sort();
}

const tagFilterPhotos = document.getElementById("tagFilterPhotos");
let selectedTagPhoto = null;
function renderTagButtonsPhotos() {
  const allTags = uniqueTags(photoItems);
  tagFilterPhotos.innerHTML =
    `<button class="tag-btn${selectedTagPhoto===null?" active":""}" data-tag="">All</button>` +
    allTags.map(tag => `<button class="tag-btn${selectedTagPhoto===tag?" active":""}" data-tag="${tag}">${tag}</button>`).join('');
}
tagFilterPhotos.addEventListener("click", function(e) {
  if (e.target.classList.contains("tag-btn")) {
    selectedTagPhoto = e.target.dataset.tag || null;
    renderTagButtonsPhotos();
    renderGallery();
  }
});

const tagFilterVideos = document.getElementById("tagFilterVideos");
let selectedTagVideo = null;
function renderTagButtonsVideos() {
  const allTags = uniqueTags(videoItems);
  tagFilterVideos.innerHTML =
    `<button class="tag-btn${selectedTagVideo===null?" active":""}" data-tag="">All</button>` +
    allTags.map(tag => `<button class="tag-btn${selectedTagVideo===tag?" active":""}" data-tag="${tag}">${tag}</button>`).join('');
}
tagFilterVideos.addEventListener("click", function(e) {
  if (e.target.classList.contains("tag-btn")) {
    selectedTagVideo = e.target.dataset.tag || null;
    renderTagButtonsVideos();
    renderVideos();
  }
});

const galleryGrid = document.getElementById("galleryGrid");
function renderGallery() {
  galleryGrid.innerHTML = "";
  photoItems
    .filter(item => !selectedTagPhoto || (item.tags && item.tags.includes(selectedTagPhoto)))
    .forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "gallery-item";
      el.innerHTML = `<img src="${item.src}" alt="${item.alt}" data-idx="${i}" />`;
      galleryGrid.appendChild(el);
    });
}

const videoGrid = document.getElementById("videoGrid");
function renderVideos() {
  videoGrid.innerHTML = "";
  videoItems
    .filter(item => !selectedTagVideo || (item.tags && item.tags.includes(selectedTagVideo)))
    .forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "gallery-item";
      el.innerHTML = `
        <img src="media/video-thumb.jpg" alt="${item.alt}" data-idx="${i}" />
        <button class="play-btn" title="Play Clip" data-idx="${i}">&#9658;</button>
      `;
      videoGrid.appendChild(el);
    });
}

const quotesList = document.getElementById("quotesList");
function renderQuotes() {
  quotesList.innerHTML = "";
  quotes.forEach(q => {
    const block = document.createElement("div");
    block.className = "quote-block";
    block.innerHTML =
      `<span>${q.text}</span>
       <span class="quote-author">— ${q.author || "Anonymous"}</span>`;
    quotesList.appendChild(block);
  });
}

const memoryMasonry = document.getElementById("memoryMasonry");
function renderMemoryWall() {
  memoryMasonry.innerHTML = "";
  memoryWall.forEach((mem, idx) => {
    const block = document.createElement("div");
    block.className = "memory-block";
    block.style.animationDelay = (0.1 * idx) + "s";
    block.innerHTML = `<h4>${mem.title}</h4><p>${mem.text}</p>`;
    memoryMasonry.appendChild(block);
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const closeLightbox = document.getElementById("closeLightbox");
const downloadBtn = document.getElementById("downloadBtn");

galleryGrid.addEventListener("click", function(e) {
  const idx = e.target.dataset.idx;
  if (typeof idx === "undefined") return;
  const item = photoItems[idx];
  lightbox.classList.remove("hidden");
  lightboxContent.innerHTML = "";
  downloadBtn.href = item.src;
  downloadBtn.download = item.download;
  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.alt;
  lightboxContent.appendChild(img);
});
videoGrid.addEventListener("click", function(e) {
  const idx = e.target.dataset.idx;
  if (typeof idx === "undefined") return;
  const item = videoItems[idx];
  if (!item) return;
  lightbox.classList.remove("hidden");
  lightboxContent.innerHTML = "";
  downloadBtn.href = item.src;
  downloadBtn.download = item.download;
  const vid = document.createElement("video");
  vid.src = item.src;
  vid.controls = true;
  vid.autoplay = true;
  vid.style.maxHeight = "54vh";
  vid.style.borderRadius = "10px";
  lightboxContent.appendChild(vid);
});
closeLightbox.onclick = () => {
  lightbox.classList.add("hidden");
  lightboxContent.innerHTML = "";
};
lightbox.addEventListener("click", function(e) {
  if (e.target === lightbox) closeLightbox.click();
});


const tripTagsDiv = document.getElementById("tripTags");
const memoryLaneRandomBtn = document.getElementById("memoryLaneRandomBtn");
const memoryLaneNextBtn = document.getElementById("memoryLaneNextBtn");
const tripDisplay = document.getElementById("tripDisplay");
let tripLaneTag = null;
let tripLaneItems = [];
let tripCurrentIdx = -1;
let tripLastType = null;

function getAllMemoryLaneTags() {
  return uniqueTags([
    ...photoItems, ...videoItems, ...quotes, ...memoryWall
  ]);
}
function renderTripTags() {
  const tags = getAllMemoryLaneTags();
  tripTagsDiv.innerHTML =
    `<button class="tag-btn${tripLaneTag===null?" active":""}" data-tag="">All</button>` +
    tags.map(tag => `<button class="tag-btn${tripLaneTag===tag?" active":""}" data-tag="${tag}">${tag}</button>`).join('');
}
tripTagsDiv.addEventListener("click", function(e) {
  if (e.target.classList.contains("tag-btn")) {
    tripLaneTag = e.target.dataset.tag || null;
    renderTripTags();
    tripCurrentIdx = -1;
    tripLaneItems = []; // Reset so next click randomizes fresh
    tripDisplay.innerHTML = "";
    memoryLaneNextBtn.style.display = "none";
  }
});

function collectTripLaneItems() {
  // Combine all types, annotate with type
  let arr = [];
  photoItems.forEach((item, i) => {
    if (!tripLaneTag || (item.tags && item.tags.includes(tripLaneTag)))
      arr.push({ ...item, type: "photo", idx: i });
  });
  videoItems.forEach((item, i) => {
    if (!tripLaneTag || (item.tags && item.tags.includes(tripLaneTag)))
      arr.push({ ...item, type: "video", idx: i });
  });
  quotes.forEach((item, i) => {
    if (!tripLaneTag || (item.tags && item.tags.includes(tripLaneTag)))
      arr.push({ ...item, type: "quote", idx: i });
  });
  memoryWall.forEach((item, i) => {
    if (!tripLaneTag || (item.tags && item.tags.includes(tripLaneTag)))
      arr.push({ ...item, type: "memory", idx: i });
  });
  return arr;
}
function showTripMemory(idx) {
  if (!tripLaneItems.length) {
    tripDisplay.innerHTML = "<em>No memories found for that tag. Try another tag or add more content!</em>";
    memoryLaneNextBtn.style.display = "none";
    return;
  }
  const item = tripLaneItems[idx];
  tripDisplay.innerHTML = "";
  if (item.type === "photo") {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.style.maxWidth = "100%";
    tripDisplay.appendChild(img);
    if (item.alt) tripDisplay.innerHTML += `<div style="margin:0.5em 0">${item.alt}</div>`;
  } else if (item.type === "video") {
    const vid = document.createElement("video");
    vid.src = item.src;
    vid.controls = true;
    vid.autoplay = true;
    vid.style.maxWidth = "100%";
    tripDisplay.appendChild(vid);
    if (item.alt) tripDisplay.innerHTML += `<div style="margin:0.5em 0">${item.alt}</div>`;
  } else if (item.type === "quote") {
    tripDisplay.innerHTML = `<div class="quote-block"><span>${item.text}</span><span class="quote-author">— ${item.author || "Anonymous"}</span></div>`;
  } else if (item.type === "memory") {
    tripDisplay.innerHTML = `<div class="memory-block"><h4>${item.title}</h4><p>${item.text}</p></div>`;
  }
  memoryLaneNextBtn.style.display = tripLaneItems.length > 1 ? "inline-block" : "none";
}
function randomizeTripLane() {
  tripLaneItems = collectTripLaneItems();
  if (!tripLaneItems.length) {
    showTripMemory(0);
    return;
  }
  tripCurrentIdx = Math.floor(Math.random() * tripLaneItems.length);
  showTripMemory(tripCurrentIdx);
}
function showNextTripLane() {
  if (!tripLaneItems.length) return;
  tripCurrentIdx = (tripCurrentIdx + 1) % tripLaneItems.length;
  showTripMemory(tripCurrentIdx);
}
memoryLaneRandomBtn.onclick = randomizeTripLane;
memoryLaneNextBtn.onclick = showNextTripLane;

document.querySelectorAll("nav a").forEach(a => {
  a.addEventListener("click", function(e) {
    const target = document.getElementById(this.getAttribute("href").slice(1));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const submitForm = document.getElementById("submitForm");
const formStatus = document.getElementById("formStatus");
const fileUploadSection = document.getElementById("fileUploadSection");
const quoteInputSection = document.getElementById("quoteInputSection");

submitForm.type.value = "";
submitForm.file.value = "";
submitForm.quoteText.value = "";

// Show/hide fields depending on type
submitForm.type.addEventListener("change", function () {
  const val = this.value;
  fileUploadSection.style.display = (val === "photo" || val === "video") ? "" : "none";
  quoteInputSection.style.display = (val === "quote" || val === "memory") ? "" : "none";
  if (val !== "photo" && val !== "video") submitForm.file.value = "";
  if (val !== "quote" && val !== "memory") submitForm.quoteText.value = "";
});

// On submit, send to email (mailto: fallback) and block actual upload
submitForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // Compose email body
  const name = submitForm.name.value;
  const email = submitForm.email.value;
  const type = submitForm.type.value;
  const tags = submitForm.tags.value;
  let body = `Submission for Charles Ryan Soliday website\n\n`;
  if (name) body += `From: ${name}\n`;
  if (email) body += `Email: ${email}\n`;
  body += `Type: ${type}\n`;
  if (tags) body += `Tags: ${tags}\n`;

  if (type === "photo" || type === "video") {
    body += `File: (attached or to be uploaded)\n`;
  }
  if (type === "quote" || type === "memory") {
    body += `\nContent:\n${submitForm.quoteText.value}\n`;
  }

  const mailto = `mailto:tsx4wu@virginia.edu?subject=New Memory Submission%20for%20Charles%20Ryan%20Soliday&body=${encodeURIComponent(body)}`;
  window.open(mailto, '_blank');
  formStatus.textContent = "Thank you for your submission! We'll review and add it soon.";
  submitForm.reset();
  fileUploadSection.style.display = "none";
  quoteInputSection.style.display = "none";
  setTimeout(() => { formStatus.textContent = ""; }, 6000);
});

// ===============================
// INITIAL PAGE LOAD
// ===============================
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = 1;
  renderTagButtonsPhotos();
  renderGallery();
  renderTagButtonsVideos();
  renderVideos();
  renderQuotes();
  renderMemoryWall();
  renderTripTags();
});