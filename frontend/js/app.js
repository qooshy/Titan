const API = "http://localhost:8000/api";

async function searchProperties() {
  const city = document.getElementById("city-input").value;
  const minPrice = document.getElementById("min-price").value;
  const maxPrice = document.getElementById("max-price").value;

  let url = `${API}/properties/?`;
  if (city) url += `city=${city}&`;
  if (minPrice) url += `min_price=${minPrice}&`;
  if (maxPrice) url += `max_price=${maxPrice}&`;

  const res = await fetch(url);
  const props = await res.json();
  renderProperties(props);
}

function renderProperties(props) {
  const grid = document.getElementById("properties-grid");
  grid.innerHTML = props.map(p => `
    <div class="property-card">
      <h3>${p.title}</h3>
      <p>📍 ${p.city} — ${p.address}</p>
      <p>💶 ${p.price?.toLocaleString("fr-FR")} €</p>
      <p>📐 ${p.surface} m² — ${p.rooms} pièces</p>
      <span class="badge ${p.status}">${p.status}</span>
    </div>
  `).join("");
}

async function loadAnalytics() {
  const res = await fetch(`${API}/analytics/price-by-city`);
  const data = await res.json();
  const div = document.getElementById("analytics-data");
  div.innerHTML = `<table>
    <tr><th>Ville</th><th>Prix moyen</th><th>Annonces</th></tr>
    ${data.map(d => `<tr><td>${d.city}</td><td>${d.avg_price?.toLocaleString("fr-FR")} €</td><td>${d.count}</td></tr>`).join("")}
  </table>`;
}

// Chargement initial
document.addEventListener("DOMContentLoaded", () => {
  searchProperties();
  loadAnalytics();
});
