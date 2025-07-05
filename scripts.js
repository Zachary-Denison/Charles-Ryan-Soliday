/*********  CONFIG  *********/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const ADMIN_EMAIL = "zachary.t.denison@gmail.com";

/*********  INIT  *********/
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
const store = firebase.storage();

/*********  NAV HELPERS  *********/
const $ = s => document.querySelector(s);
const sections = {
  photos:       $("#photos"),
  videos:       $("#videos"),
  memoryWall:   $("#memory-wall"),
  upload:       $("#upload-section"),
  pending:      $("#pending")
};
function show(id) {
  Object.values(sections).forEach(sec => sec.hidden = true);
  if (sections[id]) sections[id].hidden = false;
}

/*********  NAV BUTTONS  *********/
$("#btn-photos"     ).onclick = () => show("photos");
$("#btn-videos"     ).onclick = () => show("videos");
$("#btn-memory-wall").onclick = () => show("memoryWall");
$("#btn-random"     ).onclick = randomMemory;

/*********  AUTH FLOW  *********/
const provider = new firebase.auth.GoogleAuthProvider();
$("#btn-login" ).onclick = () => auth.signInWithPopup(provider);
$("#btn-logout").onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  const loggedIn = !!user;
  $("#btn-login" ).hidden =  loggedIn;
  $("#btn-logout").hidden = !loggedIn;
  sections.upload .hidden = !loggedIn;
  sections.pending.hidden = !(loggedIn && user.email === ADMIN_EMAIL);

  if (loggedIn) { loadMedia(); loadMemories(); if (user.email === ADMIN_EMAIL) loadPending(); }
});

/*********  LOADERS  *********/
async function loadMedia() {
  const snap = await db.collection("media").where("approved","==",true).get();
  const photos = $("#photo-grid");  const videos = $("#video-grid");
  photos.innerHTML = videos.innerHTML = "";
  snap.forEach(doc => {
    const m = doc.data();
    if (m.type === "photo") {
      photos.innerHTML += `<a href="${m.url}" data-lightbox="photos" data-title="${m.title} — ${m.author}">
                            <img src="${m.url}" alt="${m.title}" style="width:100%;border-radius:.5rem;">
                           </a>`;
    } else {
      const id = `v_${doc.id}`;
      videos.innerHTML += `<video id="${id}" class="video-js vjs-default-skin" controls preload="auto" width="100%" data-setup='{"fluid":true}'>
                             <source src="${m.url}" type="video/mp4">
                           </video>`;
    }
  });
}

async function loadMemories() {
  const list = $("#memory-list");
  const snap = await db.collection("memories").where("approved","==",true).orderBy("timestamp","desc").get();
  list.innerHTML = "";
  snap.forEach(d => {
    const m = d.data();
    list.innerHTML += `<div class="memory-card"><strong>${m.title}</strong>
                       <p>${m.text}</p><small>— ${m.author}</small></div>`;
  });
}

/*********  RANDOM MEMORY  *********/
async function randomMemory() {
  const snap = await db.collection("memories").where("approved","==",true).get();
  if (!snap.size) return alert("No memories yet.");
  const pick = snap.docs[Math.floor(Math.random()*snap.size)].data();
  alert(`${pick.title}\n\n${pick.text}\n\n— ${pick.author}`);
}

/*********  UPLOAD FLOW  *********/
$("#upload-form").addEventListener("submit", async e => {
  e.preventDefault();
  const file = $("#file-input").files[0];
  if (!file) return;
  const user = auth.currentUser;
  const isAdmin = user.email === ADMIN_EMAIL;

  const ref = store.ref(`${isAdmin?"approved":"pending"}/${Date.now()}_${file.name}`);
  await ref.put(file);
  const url = await ref.getDownloadURL();

  await db.collection("media").add({
    url, title: $("#title-input").value,
    tags: $("#tags-input").value.split(/, *|$/).filter(Boolean),
    type: file.type.startsWith("video") ? "video" : "photo",
    author: user.displayName || user.email,
    email: user.email,
    approved: isAdmin,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  $("#upload-status").textContent = isAdmin ? "Uploaded & live!" : "Uploaded – awaiting approval.";
  e.target.reset();
  if (isAdmin) loadMedia();
});

/*********  ADMIN DASH  *********/
async function loadPending() {
  const list = $("#pending-list");
  const snap = await db.collection("media").where("approved","==",false).get();
  list.innerHTML = "";
  snap.forEach(doc => {
    const m = doc.data();
    list.innerHTML += `<div class="memory-card">
        <p><strong>${m.title}</strong> (${m.type})<br>by ${m.author}</p>
        <button onclick="approve('${doc.id}')">Approve</button>
        <button onclick="deny('${doc.id}')">Delete</button>
      </div>`;
  });
}
async function approve(id){ await db.collection("media").doc(id).update({approved:true}); loadPending(); loadMedia(); }
async function deny(id){ await db.collection("media").doc(id).delete(); loadPending(); }

/*********  MISC  *********/
$("#year").textContent = new Date().getFullYear();
