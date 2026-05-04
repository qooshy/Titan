const API = "http://localhost:8000/api";
let currentUser = null;

// SVG icons (inline, no emojis)
const ICONS = {
  residential: `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
  </svg>`,
  professional: `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
  </svg>`,
  hq: `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/>
  </svg>`,
  agency: `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
  </svg>`
};

// ── Navigation ────────────────────────────────────────────────────────────────
function showSection(name) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(name).classList.add("active");
  document.getElementById("hero").style.display = (name === "properties") ? "block" : "none";

  if (name === "agencies") loadAgencies();
  if (name === "analytics") loadAnalytics();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
async function doLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errDiv = document.getElementById("login-error");

  try {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      currentUser = await res.json();
      updateAuthArea();
      showSection("properties");
      errDiv.style.display = "none";
    } else {
      const err = await res.json();
      errDiv.textContent = err.detail || "Email ou mot de passe incorrect";
      errDiv.style.display = "block";
    }
  } catch (e) {
    errDiv.textContent = "Erreur de connexion au serveur";
    errDiv.style.display = "block";
  }
}

async function doRegister() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const errDiv = document.getElementById("register-error");
  const okDiv = document.getElementById("register-success");

  try {
    const res = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name, email, password, role: "client" })
    });

    if (res.ok) {
      okDiv.textContent = "Compte créé. Vous pouvez vous connecter.";
      okDiv.style.display = "block";
      errDiv.style.display = "none";
      setTimeout(() => showSection("login"), 1500);
    } else {
      const err = await res.json();
      errDiv.textContent = err.detail || "Erreur lors de l'inscription";
      errDiv.style.display = "block";
      okDiv.style.display = "none";
    }
  } catch (e) {
    errDiv.textContent = "Erreur de connexion au serveur";
    errDiv.style.display = "block";
  }
}

function doLogout() {
  currentUser = null;
  updateAuthArea();
  showSection("properties");
}

function updateAuthArea() {
  const area = document.getElementById("auth-area");
  if (currentUser) {
    const roleLabels = {
      client: "Client", commercial: "Commercial", direction: "Direction",
      marketing: "Marketing", rh_juridique: "RH / Juridique", it_support: "IT Support"
    };
    area.innerHTML = `
      <span class="user-badge">${currentUser.full_name} <em>${roleLabels[currentUser.role] || currentUser.role}</em></span>
      <button class="btn-outline" onclick="doLogout()">Déconnexion</button>
    `;
  } else {
    area.innerHTML = `<button class="btn-outline" onclick="showSection('login')">Connexion</button>`;
  }
}

// ── Biens ─────────────────────────────────────────────────────────────────────
async function searchProperties() {
  const city = document.getElementById("city-input").value;
  const minPrice = document.getElementById("min-price").value;
  const maxPrice = document.getElementById("max-price").value;
  const type = document.getElementById("type-filter").value;

  let url = `${API}/properties/?limit=50`;
  if (city) url += `&city=${encodeURIComponent(city)}`;
  if (minPrice) url += `&min_price=${minPrice}`;
  if (maxPrice) url += `&max_price=${maxPrice}`;
  if (type) url += `&property_type=${type}`;

  const grid = document.getElementById("properties-grid");
  grid.innerHTML = `<div class="loading">Chargement...</div>`;

  try {
    const res = await fetch(url);
    const props = await res.json();
    document.getElementById("props-count").textContent = `${props.length} bien(s)`;
    renderProperties(props);
  } catch (e) {
    grid.innerHTML = `<div class="empty">Impossible de charger les biens.</div>`;
  }
}

function renderProperties(props) {
  const grid = document.getElementById("properties-grid");
  if (!props.length) {
    grid.innerHTML = `<div class="empty">Aucun bien trouvé pour ces critères.</div>`;
    return;
  }
  grid.innerHTML = props.map(p => `
    <div class="property-card" onclick="openModal(${p.id})">
      <div class="card-img">
        <div class="card-img-icon">${ICONS[p.property_type] || ICONS.residential}</div>
        <span class="card-img-type">${p.property_type === "professional" ? "Professionnel" : "Résidentiel"}</span>
      </div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p class="card-location">${p.city}${p.address ? " — " + p.address : ""}</p>
        <p class="card-price">${p.price?.toLocaleString("fr-FR")} €</p>
        <p class="card-details">${p.surface} m² &nbsp;&middot;&nbsp; ${p.rooms} pièce(s)</p>
        <div class="card-footer">
          <span class="badge ${p.status}">${statusLabel(p.status)}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function statusLabel(s) {
  return { available: "Disponible", sold: "Vendu", under_offer: "Sous offre" }[s] || s;
}

async function openModal(id) {
  const res = await fetch(`${API}/properties/${id}`);
  const p = await res.json();
  document.getElementById("modal-content").innerHTML = `
    <div class="modal-header">
      <div class="modal-type-icon">${ICONS[p.property_type] || ICONS.residential}</div>
      <div>
        <h2>${p.title}</h2>
        <span class="badge ${p.status}">${statusLabel(p.status)}</span>
      </div>
    </div>
    <p class="modal-price">${p.price?.toLocaleString("fr-FR")} €</p>
    <div class="modal-details">
      <div><strong>Ville</strong>${p.city}</div>
      <div><strong>Adresse</strong>${p.address || "—"}</div>
      <div><strong>Surface</strong>${p.surface} m²</div>
      <div><strong>Pièces</strong>${p.rooms}</div>
      <div><strong>Type</strong>${p.property_type === "professional" ? "Professionnel" : "Résidentiel"}</div>
      <div><strong>Statut</strong><span class="badge ${p.status}">${statusLabel(p.status)}</span></div>
    </div>
    ${p.description ? `<p class="modal-desc">${p.description}</p>` : ""}
    ${currentUser
      ? `<button class="btn-contact" onclick="alert('Demande transmise à l\\'agence.')">Contacter l'agence</button>`
      : `<button class="btn-contact" onclick="showSection('login'); closeModal()">Connectez-vous pour contacter</button>`
    }
  `;
  document.getElementById("modal-overlay").classList.add("active");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

// ── Agences ───────────────────────────────────────────────────────────────────
async function loadAgencies() {
  const grid = document.getElementById("agencies-grid");
  grid.innerHTML = `<div class="loading">Chargement...</div>`;
  try {
    const res = await fetch(`${API}/agencies/`);
    const agencies = await res.json();
    grid.innerHTML = agencies.map(a => `
      <div class="agency-card ${a.is_headquarters ? 'hq' : ''}">
        <div class="agency-icon">${a.is_headquarters ? ICONS.hq : ICONS.agency}</div>
        ${a.is_headquarters ? '<span class="hq-badge">Siège social</span>' : ""}
        <h3>${a.name}</h3>
        <p>${a.city}</p>
        <p>${a.address}</p>
        <p>${a.phone}</p>
      </div>
    `).join("");
  } catch (e) {
    grid.innerHTML = `<div class="empty">Impossible de charger les agences.</div>`;
  }
}

// ── Analytics ─────────────────────────────────────────────────────────────────
async function loadAnalytics() {
  try {
    const res = await fetch(`${API}/analytics/price-by-city`);
    const data = await res.json();
    document.getElementById("price-by-city").innerHTML = `
      <table>
        <thead><tr><th>Ville</th><th>Prix moyen</th><th>Annonces</th></tr></thead>
        <tbody>${data.map(d => `
          <tr>
            <td>${d.city}</td>
            <td>${d.avg_price?.toLocaleString("fr-FR")} €</td>
            <td>${d.count}</td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  } catch (e) {}

  try {
    const res = await fetch(`${API}/analytics/popular-cities`);
    const data = await res.json();
    const max = data[0]?.listings || 1;
    document.getElementById("popular-cities").innerHTML = data.map(d => `
      <div class="bar-row">
        <span class="bar-label">${d.city}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.round(d.listings / max * 100)}%"></div>
        </div>
        <span class="bar-value">${d.listings}</span>
      </div>`).join("");
  } catch (e) {}
}

async function estimatePrice() {
  const city = document.getElementById("est-city").value;
  const surface = document.getElementById("est-surface").value;
  const rooms = document.getElementById("est-rooms").value;
  const result = document.getElementById("estimate-result");

  if (!city || !surface || !rooms) {
    result.innerHTML = `<span class="error-msg">Remplissez tous les champs.</span>`;
    return;
  }

  result.innerHTML = `<span class="loading">Calcul en cours...</span>`;
  try {
    const res = await fetch(`${API}/analytics/price-prediction?city=${encodeURIComponent(city)}&surface=${surface}&rooms=${rooms}`);
    const data = await res.json();
    if (data.error) {
      result.innerHTML = `<span class="error-msg">${data.error}</span>`;
    } else {
      result.innerHTML = `
        <div class="estimate-box">
          <div class="estimate-price">~${data.predicted_price?.toLocaleString("fr-FR")} €</div>
          <div class="estimate-meta">Basé sur ${data.based_on} bien(s) à ${data.city}</div>
        </div>`;
    }
  } catch (e) {
    result.innerHTML = `<span class="error-msg">Erreur de calcul.</span>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  showSection("properties");
  searchProperties();
});