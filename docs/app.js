/* ─────────────────────────────────────────────────────────
   ILIA HACCP — app.js (static / localStorage version)
──────────────────────────────────────────────────────────── */

// ── Data ────────────────────────────────────────────────────
const RESTAURANTS = [
  { id: 3287, name: "Mathurins" },
  { id: 4240, name: "Delivery Hub" },
  { id: 5523, name: "Washington" },
  { id: 5829, name: "Casanova" },
  { id: 5830, name: "Rivière" },
  { id: 5831, name: "La Défense 1" },
  { id: 5832, name: "Caumartin" },
  { id: 5833, name: "Bourse" },
];

const FRIDGES = {
  3287: [
    { id: 1, name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 2, name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 3, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
  4240: [
    { id: 4, name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 5, name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 6, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
  5523: [
    { id: 7,  name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 8,  name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 9,  name: "Frigo 3", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 10, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
  5829: [
    { id: 11, name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 12, name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 13, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
  5830: [
    { id: 14, name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 15, name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 16, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
  5831: [
    { id: 17, name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 18, name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 19, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
  5832: [
    { id: 20, name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 21, name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 22, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
  5833: [
    { id: 23, name: "Frigo 1", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 24, name: "Frigo 2", type: "froid",      min_temp: 0, max_temp: 4 },
    { id: 25, name: "Congélateur", type: "congelateur", min_temp: -25, max_temp: -18 },
  ],
};

// ── localStorage helpers ────────────────────────────────────
const LS_KEY     = "ilia_haccp_records";
const LS_DLC_KEY = "ilia_haccp_dlc";

function getRecords() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function saveRecord(record) {
  const records = getRecords();
  record.id = Date.now();
  record.created_at = new Date().toISOString();
  records.push(record);
  localStorage.setItem(LS_KEY, JSON.stringify(records));
}

function getDlcRecords() {
  try { return JSON.parse(localStorage.getItem(LS_DLC_KEY) || "[]"); }
  catch { return []; }
}

function saveDlcRecord(record) {
  const records = getDlcRecords();
  record.id = Date.now();
  record.created_at = new Date().toISOString();
  records.push(record);
  localStorage.setItem(LS_DLC_KEY, JSON.stringify(records));
}

// ── Boot ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  document.getElementById("header-date").textContent =
    now.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" });

  document.getElementById("hist-date").value = now.toISOString().slice(0, 10);

  // Default DLC opened date to today
  document.getElementById("dlc-opened-date").value = now.toISOString().slice(0, 10);
  onDlcDateChange();

  renderRestaurantGrid();
  populateRestaurantSelects();
});

// ── Navigation ─────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  document.getElementById(`page-${name}`).classList.add("active");
  document.querySelector(`nav button[data-page="${name}"]`).classList.add("active");
  if (name === "history") loadHistory();
}

// ── Restaurants ────────────────────────────────────────────
function renderRestaurantGrid() {
  const grid = document.getElementById("restaurant-grid");
  grid.innerHTML = RESTAURANTS.map(r => `
    <div class="restaurant-card" onclick="selectRestaurantFromHome(${r.id})">
      <span class="icon">🍽️</span>
      ${r.name}
    </div>
  `).join("");
}

function populateRestaurantSelects() {
  const options = RESTAURANTS.map(r => `<option value="${r.id}">${r.name}</option>`).join("");
  document.getElementById("sel-restaurant").innerHTML   = `<option value="">— choisir —</option>` + options;
  document.getElementById("hist-restaurant").innerHTML  = `<option value="">Tous les restaurants</option>` + options;
  document.getElementById("dlc-restaurant").innerHTML   = `<option value="">— choisir —</option>` + options;
}

// ── Select from Home ───────────────────────────────────────
function selectRestaurantFromHome(restaurantId) {
  document.getElementById("sel-restaurant").value = restaurantId;
  onRestaurantChange();
  showPage("entry");
}

// ── Entry page ─────────────────────────────────────────────
function onRestaurantChange() {
  const rid = parseInt(document.getElementById("sel-restaurant").value);
  const fridgeSel = document.getElementById("sel-fridge");
  const banner = document.getElementById("entry-restaurant-banner");

  fridgeSel.innerHTML = `<option value="">— choisir —</option>`;
  fridgeSel.disabled = true;
  resetTempIndicator();
  updateSubmitBtn();

  if (!rid) { banner.style.display = "none"; return; }

  const r = RESTAURANTS.find(x => x.id === rid);
  banner.textContent = `📍 ${r ? r.name : ""}`;
  banner.style.display = "block";

  const fridges = FRIDGES[rid] || [];
  fridgeSel.innerHTML = `<option value="">— choisir —</option>` +
    fridges.map(f => {
      const typeLabel = f.type === "congelateur" ? "❄️ Congélateur" : "🧊 Frigo";
      return `<option value="${f.id}"
                data-min="${f.min_temp}" data-max="${f.max_temp}"
                data-name="${f.name}">
                ${typeLabel} · ${f.name}
              </option>`;
    }).join("");
  fridgeSel.disabled = false;
}

function onFridgeChange() { onTempInput(); updateSubmitBtn(); }

function onTempInput() {
  const temp = parseFloat(document.getElementById("inp-temp").value);
  const fridgeSel = document.getElementById("sel-fridge");
  const opt = fridgeSel.options[fridgeSel.selectedIndex];
  const indicator = document.getElementById("temp-indicator");
  const icon  = document.getElementById("temp-icon");
  const label = document.getElementById("temp-label");

  if (isNaN(temp) || !opt || !opt.value) {
    resetTempIndicator(); updateSubmitBtn(); return;
  }

  const min = parseFloat(opt.dataset.min);
  const max = parseFloat(opt.dataset.max);
  const isOk = temp >= min && temp <= max;

  indicator.className = `temp-indicator ${isOk ? "ok" : "warn"}`;
  if (isOk) {
    icon.textContent  = "✅";
    label.textContent = `${temp}°C — Conforme (plage ${min}°C à ${max}°C)`;
  } else {
    icon.textContent  = "⚠️";
    label.textContent = `${temp}°C — HORS PLAGE ! (plage ${min}°C à ${max}°C)`;
  }
  updateSubmitBtn();
}

function resetTempIndicator() {
  document.getElementById("temp-icon").textContent  = "—";
  document.getElementById("temp-label").textContent = "Saisissez la température";
  document.getElementById("temp-indicator").className = "temp-indicator idle";
}

function updateSubmitBtn() {
  const rid      = document.getElementById("sel-restaurant").value;
  const fridge   = document.getElementById("sel-fridge").value;
  const employee = document.getElementById("inp-employee").value;
  const temp     = document.getElementById("inp-temp").value;
  document.getElementById("btn-submit").disabled = !(rid && fridge && employee && temp !== "");
}

function submitRecord() {
  const fridgeSel  = document.getElementById("sel-fridge");
  const opt        = fridgeSel.options[fridgeSel.selectedIndex];
  const temp       = parseFloat(document.getElementById("inp-temp").value);
  const min        = parseFloat(opt.dataset.min);
  const max        = parseFloat(opt.dataset.max);

  const record = {
    restaurant_id: parseInt(document.getElementById("sel-restaurant").value),
    fridge_id:     parseInt(fridgeSel.value),
    fridge_name:   opt.dataset.name,
    employee_name: document.getElementById("inp-employee").value,
    temperature:   temp,
    is_ok:         temp >= min && temp <= max,
  };

  saveRecord(record);
  toast("✅ Relevé enregistré !");

  // Reset form (keep restaurant)
  fridgeSel.selectedIndex = 0;
  document.getElementById("inp-temp").value = "";
  document.getElementById("inp-employee").selectedIndex = 0;
  resetTempIndicator();
  updateSubmitBtn();
}

// ── History ────────────────────────────────────────────────
function loadHistory() {
  const rid      = document.getElementById("hist-restaurant").value;
  const dateStr  = document.getElementById("hist-date").value || new Date().toISOString().slice(0, 10);
  const container = document.getElementById("history-content");

  let records = getRecords().filter(r => r.created_at.startsWith(dateStr));
  if (rid) records = records.filter(r => r.restaurant_id === parseInt(rid));

  if (!records.length) {
    container.innerHTML = `<p class="empty-state">Aucun relevé pour cette sélection.</p>`;
    return;
  }

  // Group by restaurant
  const byResto = {};
  records.forEach(r => {
    if (!byResto[r.restaurant_id]) byResto[r.restaurant_id] = [];
    byResto[r.restaurant_id].push(r);
  });

  let html = "";
  for (const [rId, rows] of Object.entries(byResto)) {
    const name = RESTAURANTS.find(x => x.id === parseInt(rId))?.name || rId;
    html += `<h3 style="margin:20px 0 10px;color:#1a6bcc;">📍 ${name}</h3>`;
    html += `<div class="table-wrapper"><table>
      <thead><tr><th>Heure</th><th>Employé</th><th>Frigo</th><th>Temp.</th><th>Statut</th></tr></thead>
      <tbody>`;
    rows.forEach(r => {
      const time  = new Date(r.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      const badge = r.is_ok
        ? `<span class="badge ok">✅ OK</span>`
        : `<span class="badge warn">⚠️ Hors plage</span>`;
      html += `<tr>
        <td>${time}</td>
        <td>${r.employee_name}</td>
        <td>${r.fridge_name}</td>
        <td style="font-weight:700">${r.temperature.toFixed(1)}°C</td>
        <td>${badge}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  }
  container.innerHTML = html;

  // ── DLC Poisson du jour ──────────────────────────────────
  const dlcContainer = document.getElementById("dlc-history-content");
  let dlcRecords = getDlcRecords().filter(r => r.created_at.startsWith(dateStr));
  if (rid) dlcRecords = dlcRecords.filter(r => r.restaurant_id === parseInt(rid));

  if (!dlcRecords.length) {
    dlcContainer.innerHTML = `<h3 style="margin:20px 0 10px;color:#0891b2;">🐟 DLC Poisson du jour</h3>
      <p class="empty-state" style="padding:20px 0;">Aucune étiquette DLC pour cette sélection.</p>`;
  } else {
    let dlcHtml = `<h3 style="margin:20px 0 10px;color:#0891b2;">🐟 DLC Poisson du jour</h3>`;
    dlcHtml += `<div class="table-wrapper"><table>
      <thead><tr><th>Heure</th><th>Produit</th><th>Ouverture</th><th>DLC</th><th>Restaurant</th><th>Par</th></tr></thead>
      <tbody>`;
    dlcRecords.forEach(r => {
      const time = new Date(r.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      dlcHtml += `<tr>
        <td>${time}</td>
        <td style="font-weight:700">🐟 ${r.product}</td>
        <td>${formatDateFR(r.opened_date)}</td>
        <td style="font-weight:700;color:#dc2626">${formatDateFR(r.dlc_date)}</td>
        <td>${r.restaurant_name}</td>
        <td>${r.employee_name}</td>
      </tr>`;
    });
    dlcHtml += `</tbody></table></div>`;
    dlcContainer.innerHTML = dlcHtml;
  }
}

// ── DLC Poisson ────────────────────────────────────────────

function onDlcProductChange() {
  const val = document.getElementById("dlc-product").value;
  const customGroup = document.getElementById("dlc-custom-group");
  customGroup.style.display = (val === "Autre") ? "block" : "none";
  if (val !== "Autre") document.getElementById("dlc-product-custom").value = "";
  updateDlcSubmitBtn();
}

function onDlcDateChange() {
  const dateStr = document.getElementById("dlc-opened-date").value;
  const display = document.getElementById("dlc-date-display");
  const dlcVal  = document.getElementById("dlc-date-value");
  if (!dateStr) { display.style.display = "none"; return; }
  const dlcDate = new Date(dateStr);
  dlcDate.setDate(dlcDate.getDate() + 2);
  dlcVal.textContent = dlcDate.toLocaleDateString("fr-FR");
  display.style.display = "block";
  updateDlcSubmitBtn();
}

function getDlcDateValue() {
  const dateStr = document.getElementById("dlc-opened-date").value;
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

function formatDateFR(isoStr) {
  if (!isoStr) return "";
  const [y, m, d] = isoStr.split("-");
  return `${d}/${m}/${y}`;
}

function updateDlcSubmitBtn() {
  const rid      = document.getElementById("dlc-restaurant").value;
  const product  = document.getElementById("dlc-product").value;
  const custom   = document.getElementById("dlc-product-custom").value.trim();
  const dateStr  = document.getElementById("dlc-opened-date").value;
  const employee = document.getElementById("dlc-employee").value;
  const ok = rid && product && (product !== "Autre" || custom) && dateStr && employee;
  document.getElementById("btn-dlc-submit").disabled = !ok;
}

function submitDlcRecord() {
  const rid       = parseInt(document.getElementById("dlc-restaurant").value);
  const resto     = RESTAURANTS.find(r => r.id === rid);
  const product   = document.getElementById("dlc-product").value;
  const custom    = document.getElementById("dlc-product-custom").value.trim();
  const openedDate = document.getElementById("dlc-opened-date").value;
  const dlcDate   = getDlcDateValue();
  const employee  = document.getElementById("dlc-employee").value;
  const productName = (product === "Autre") ? custom : product;

  const record = {
    restaurant_id:   rid,
    restaurant_name: resto ? resto.name : "",
    product:         productName,
    product_custom:  (product === "Autre") ? custom : "",
    opened_date:     openedDate,
    dlc_date:        dlcDate,
    employee_name:   employee,
  };

  saveDlcRecord(record);
  toast("✅ Étiquette enregistrée !");

  // Show label preview
  const card = document.getElementById("dlc-label-card");
  card.innerHTML = `
    <div style="font-size:1.4rem;font-weight:700;margin-bottom:12px;">🐟 ${productName}</div>
    <div>Ouverture : <strong>${formatDateFR(openedDate)}</strong></div>
    <div>DLC : <strong>${formatDateFR(dlcDate)}</strong></div>
    <div>Restaurant : <strong>${resto ? resto.name : ""}</strong></div>
    <div>Par : <strong>${employee}</strong></div>
  `;
  document.getElementById("dlc-label-preview").style.display = "block";
}

// ── Toast ──────────────────────────────────────────────────
function toast(msg, duration = 3000) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), duration);
}
