// ----------- GALLERY DATA WITH TAGS -----------
const galleryItems = [
    {
      type: "image",
      src: "media/forest.jpg",
      alt: "Tranquil forest",
      download: "forest.jpg",
      tags: ["forest", "trees", "nature", "calm"]
    },
    {
      type: "video",
      src: "media/river.mp4",
      alt: "River flowing",
      download: "river.mp4",
      tags: ["river", "water", "nature", "relaxing"]
    },
    {
      type: "image",
      src: "media/mountain.jpg",
      alt: "Mountain vista",
      download: "mountain.jpg",
      tags: ["mountain", "landscape", "sunrise", "nature"]
    },
    {
      type: "video",
      src: "media/birds.mp4",
      alt: "Birds chirping",
      download: "birds.mp4",
      tags: ["birds", "audio", "forest", "wildlife"]
    }
  ];
  
  // ----------- MEMORY WALL DUMMY DATA -----------
  const memoryWall = [
    {
      title: "Campsite under the Stars",
      text: "We spent the night under a sky so clear, the Milky Way was visible. The fire crackled gently all night."
    },
    {
      title: "First River Swim",
      text: "Braved the icy water for the first time! The laughter and chills still make me smile."
    },
    {
      title: "Mountain Sunrise",
      text: "Woke up at 4am for this. The sunrise over the peaks was worth every minute."
    },
    {
      title: "Rainy Afternoons",
      text: "Listening to rain on the tent, playing cards, and telling stories with friends."
    }
  ];
  
  // ----------- TAG FILTER UI AND LOGIC -----------
  const tagFilter = document.getElementById("tagFilter");
  let selectedTag = null;
  
  // Collect unique tags, sorted
  const allTags = Array.from(new Set(galleryItems.flatMap(item => item.tags || []))).sort();
  
  // Render tag buttons
  function renderTagButtons() {
    tagFilter.innerHTML = `<button class="tag-btn${selectedTag===null?" active":""}" data-tag="">All</button>` +
      allTags.map(tag =>
        `<button class="tag-btn${selectedTag===tag?" active":""}" data-tag="${tag}">${tag}</button>`
      ).join('');
  }
  renderTagButtons();
  
  // Listen for tag filter clicks
  tagFilter.addEventListener("click", function(e) {
    if (e.target.classList.contains("tag-btn")) {
      selectedTag = e.target.dataset.tag || null;
      renderTagButtons();
      renderGallery();
    }
  });
  
  // ----------- GALLERY RENDERING WITH TAG FILTERING -----------
  const galleryGrid = document.getElementById("galleryGrid");
  
  function renderGallery() {
    galleryGrid.innerHTML = "";
    galleryItems
      .filter(item => !selectedTag || (item.tags && item.tags.includes(selectedTag)))
      .forEach((item, i) => {
        const el = document.createElement("div");
        el.className = "gallery-item";
        if (item.type === "image") {
          el.innerHTML = `<img src="${item.src}" alt="${item.alt}" data-idx="${i}" />`;
        } else if (item.type === "video") {
          el.innerHTML = `
            <img src="media/video-thumb.jpg" alt="${item.alt}" data-idx="${i}" />
            <button class="play-btn" title="Play Clip" data-idx="${i}">&#9658;</button>
          `;
        }
        galleryGrid.appendChild(el);
      });
  }
  renderGallery();
  
  // ----------- MEMORY WALL RENDERING -----------
  const memoryMasonry = document.getElementById("memoryMasonry");
  memoryWall.forEach((mem, idx) => {
    const block = document.createElement("div");
    block.className = "memory-block";
    block.style.animationDelay = (0.1 * idx) + "s";
    block.innerHTML = `<h4>${mem.title}</h4><p>${mem.text}</p>`;
    memoryMasonry.appendChild(block);
  });
  
  // ----------- LIGHTBOX ----------- 
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightboxContent");
  const closeLightbox = document.getElementById("closeLightbox");
  const downloadBtn = document.getElementById("downloadBtn");
  
  galleryGrid.addEventListener("click", function(e) {
    const idx = e.target.dataset.idx;
    if (typeof idx === "undefined") return;
    const item = galleryItems[idx];
    lightbox.classList.remove("hidden");
    lightboxContent.innerHTML = "";
    downloadBtn.href = item.src;
    downloadBtn.download = item.download;
    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      lightboxContent.appendChild(img);
    } else if (item.type === "video") {
      const vid = document.createElement("video");
      vid.src = item.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.style.maxHeight = "54vh";
      vid.style.borderRadius = "10px";
      lightboxContent.appendChild(vid);
    }
  });
  closeLightbox.onclick = () => {
    lightbox.classList.add("hidden");
    lightboxContent.innerHTML = "";
  };
  lightbox.addEventListener("click", function(e) {
    if (e.target === lightbox) closeLightbox.click();
  });
  
  // ----------- SCROLL BUTTON -----------
  document.getElementById("scrollGallery").onclick = function() {
    document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
  };
  
  // ----------- CONTACT FORM HANDLER -----------
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    formStatus.textContent = "Thank you! (Demo only, not sent)";
    contactForm.reset();
    setTimeout(() => { formStatus.textContent = ""; }, 4000);
  });
  
  // ----------- GENTLE TRANSITIONS ON PAGE LOAD -----------
  window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = 1;
  });