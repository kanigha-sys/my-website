// ---------- Configuration ----------
const OWNER_PASSWORD = "ospc-secret"; // <<< CHANGE THIS before using live
const STORAGE_KEY = "ctf_registrations_v1";

// ---------- Navigation (single-page) ----------
document.querySelectorAll(".nav-btn, .cta-primary").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const target = btn.dataset.target || btn.getAttribute("data-target") || (e.target.getAttribute("data-target"));
    if(target) showSection(target);
  });
});

function showSection(name){
  document.querySelectorAll(".section").forEach(s=> s.classList.remove("active"));
  const sec = document.getElementById(name);
  if(sec) sec.classList.add("active");

  // mark active nav button
  document.querySelectorAll(".nav-btn").forEach(b=> b.classList.remove("active"));
  const navBtn = [...document.querySelectorAll(".nav-btn")].find(b=>b.dataset.target === name);
  if(navBtn) navBtn.classList.add("active");
}

// ---------- Captcha ----------
let captchaAnswer = null;
function genCaptcha(){
  const a = Math.floor(Math.random()*9)+1;
  const b = Math.floor(Math.random()*9)+1;
  captchaAnswer = a + b;
  document.getElementById("captchaText").textContent = `${a} + ${b} = ?`;
}
document.getElementById("regenCaptcha").addEventListener("click", genCaptcha);
genCaptcha();

// ---------- Form handling ----------
const form = document.getElementById("regForm");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", function(ev){
  ev.preventDefault();
  msg.textContent = "";
  const data = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    mobile: form.mobile.value.trim(),
    gender: form.gender.value,
    profession: form.profession.value,
    dob: form.dob.value,
    time: new Date().toISOString()
  };

  // simple validation
  if(!data.firstName || !data.email){
    msg.textContent = "Please fill required fields.";
    return;
  }
  const cap = document.getElementById("captchaInput").value.trim();
  if(String(captchaAnswer) !== cap){
    msg.textContent = "Captcha mismatch. Try again.";
    genCaptcha();
    return;
  }

  // save to localStorage
  saveRegistration(data);

  // success UI
  msg.textContent = `Thanks, ${data.firstName}! Registration received.`;
  form.reset();
  genCaptcha();
});

// Save registration to localStorage array
function saveRegistration(obj){
  const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  arr.push(obj);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  // increment any visible counter for owner if shown
  updateAdminCounts();
}

// ---------- Owner admin ----------
document.getElementById("ownerLoginBtn").addEventListener("click", () => {
  const pw = prompt("Enter owner password to view registrations:");
  if(pw === OWNER_PASSWORD){
    showSection("admin");
    document.getElementById("admin").style.display = "block";
    renderAdmin();
  } else {
    alert("Incorrect password.");
  }
});

// render admin table
function renderAdmin(){
  const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const tbody = document.querySelector("#regTable tbody");
  tbody.innerHTML = "";
  arr.forEach((r,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td>
      <td>${escapeHtml(r.firstName)} ${escapeHtml(r.lastName || "")}</td>
      <td>${escapeHtml(r.email)}</td>
      <td>${escapeHtml(r.mobile)}</td>
      <td>${escapeHtml(r.profession)}</td>
      <td>${escapeHtml(r.dob)}</td>
      <td>${new Date(r.time).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById("totalCount").textContent = arr.length;
}

function updateAdminCounts(){
  const sec = document.getElementById("admin");
  if(sec && sec.classList.contains("active")){
    renderAdmin();
  }
}

// Export CSV
document.getElementById("exportCsv").addEventListener("click", ()=>{
  const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if(!arr.length){ alert("No registrations to export."); return; }
  const headers = ["FirstName","LastName","Email","Mobile","Gender","Profession","DOB","Time"];
  const rows = arr.map(r => [
    r.firstName, r.lastName || "", r.email, r.mobile, r.gender, r.profession, r.dob, r.time
  ]);
  const csv = [headers, ...rows].map(r=> r.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], {type: "text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "ctf_registrations.csv"; a.click();
  URL.revokeObjectURL(url);
});

// Clear all (destructive) — owner only
document.getElementById("clearAll").addEventListener("click", ()=>{
  if(!confirm("Clear all registrations? This cannot be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderAdmin();
});

// small helpers
function escapeHtml(s){ if(!s) return ""; return String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]); }
function escapeCsv(cell){
  if(cell == null) return "";
  const str = String(cell);
  if(str.includes(",") || str.includes('"') || str.includes("\n")){
    return '"' + str.replace(/"/g,'""') + '"';
  }
  return str;
}

// initialize admin counts if visible
updateAdminCounts();

// make privacy and terms clickable placeholders
document.getElementById("privacyLink").addEventListener("click", (e)=>{
  e.preventDefault();
  alert("Edit the privacy policy content in the HTML or add a dedicated page.");
});
document.getElementById("termsLink").addEventListener("click", (e)=>{
  e.preventDefault();
  alert("Edit the terms of service content in the HTML or add a dedicated page.");
});
