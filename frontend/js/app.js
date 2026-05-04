const API = "http://localhost:8000/api";
let currentUser = null;

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
    // On récupère tous les users et on cherche par email (simple pour le projet)
    // En prod on utiliserait un vrai endpoint /login avec JWT
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
      okDiv.textContent = "Compte créé ! Vous pouvez vous connecter.";
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
      marketing: "Marketing", rh_juridique: "RH/Juridique", it_support: "IT Support"
    };
    area.innerHTML = `
      <span class="user-badge">${currentUser.full_name} <em>(${roleLabels[currentUser.role] || currentUser.role})</em></span>
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
    document.getElementById("props-count").textContent = `${props.length} bien(s) trouvé(s)`;
    renderProperties(props);
  } catch (e) {
    grid.innerHTML = `<div class="error-msg">Erreur de chargement</div>`;
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
      <div class="card-img">${p.property_type === "professional" ? "🏢" : "🏠"}</div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p class="card-location">📍 ${p.city}${p.address ? " — " + p.address : ""}</p>
        <p class="card-price">💶 ${p.price?.toLocaleString("fr-FR")} €</p>
        <p class="card-details">📐 ${p.surface} m² &nbsp;·&nbsp; ${p.rooms} pièce(s)</p>
        <div class="card-footer">
          <span class="badge ${p.status}">${statusLabel(p.status)}</span>
          <span class="type-tag">${p.property_type === "professional" ? "Professionnel" : "Résidentiel"}</span>
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
    <div class="modal-icon">${p.property_type === "professional" ? "🏢" : "🏠"}</div>
    <h2>${p.title}</h2>
    <p class="modal-price">💶 ${p.price?.toLocaleString("fr-FR")} €</p>
    <div class="modal-details">
      <div><strong>Ville</strong><br>${p.city}</div>
      <div><strong>Adresse</strong><br>${p.address || "—"}</div>
      <div><strong>Surface</strong><br>${p.surface} m²</div>
      <div><strong>Pièces</strong><br>${p.rooms}</div>
      <div><strong>Type</strong><br>${p.property_type === "professional" ? "Professionnel" : "Résidentiel"}</div>
      <div><strong>Statut</strong><br><span class="badge ${p.status}">${statusLabel(p.status)}</span></div>
    </div>
    <p class="modal-desc">${p.description || ""}</p>
    ${currentUser ? `<button class="btn-contact" onclick="alert('Demande envoyée à l\\'agence !')">📞 Contacter l'agence</button>` : `<button class="btn-contact" onclick="showSection('login'); closeModal()">Connectez-vous pour contacter</button>`}
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
        <div class="agency-icon">${a.is_headquarters ? "🏛️" : "🏪"}</div>
        <h3>${a.name}</h3>
        ${a.is_headquarters ? '<span class="hq-badge">Siège social</span>' : ""}
        <p>📍 ${a.city}</p>
        <p>🏠 ${a.address}</p>
        <p>📞 ${a.phone}</p>
      </div>
    `).join("");
  } catch (e) {
    grid.innerHTML = `<div class="error-msg">Erreur de chargement</div>`;
  }
}

// ── Analytics ─────────────────────────────────────────────────────────────────
async function loadAnalytics() {
  // Prix par ville
  try {
    const res = await fetch(`${API}/analytics/price-by-city`);
    const data = await res.json();
    document.getElementById("price-by-city").innerHTML = `
      <table>
        <tr><th>Ville</th><th>Prix moyen</th><th>Annonces</th></tr>
        ${data.map(d => `
          <tr>
            <td>${d.city}</td>
            <td>${d.avg_price?.toLocaleString("fr-FR")} €</td>
            <td>${d.count}</td>
          </tr>`).join("")}
      </table>`;
  } catch (e) {}

  // Villes populaires
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
    result.innerHTML = `<span class="error-msg">Remplissez tous les champs</span>`;
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
    result.innerHTML = `<span class="error-msg">Erreur</span>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  showSection("properties");
  searchProperties();
});
