/* ─────────────────────────────────────────────────────────
   ILIA HACCP — app.js
   Vanilla JS SPA, no external dependencies
──────────────────────────────────────────────────────────── */

// ── State ──────────────────────────────────────────────────
let restaurants = [];
let fridgesByRestaurant = {};   // cache: restaurant_id → fridge[]
let selectedRestaurantForEntry = null; // set when clicking a card on home

// ── Boot ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Date in header
  const now = new Date();
  document.getElementById("header-date").textContent =
    now.toLocaleDateString("fr-FR", { weekday:"short", day:"numeric", month:"long" });

  // Set history date to today
  const todayISO = now.toISOString().slice(0, 10);
  document.getElementById("hist-date").value = todayISO;

  loadRestaurants();
});

// ── Navigation ─────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));

  document.getElementById(`page-${name}`).classList.add("active");
  document.querySelector(`nav button[data-page="${name}"]`).classList.add("active");

  if (name === "history") loadHistory();
}

// ── API helpers ────────────────────────────────────────────
async function apiFetch(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Restaurants ────────────────────────────────────────────
async function loadRestaurants() {
  try {
    restaurants = await apiFetch("/restaurants");
    renderRestaurantGrid();
    populateRestaurantSelects();
  } catch (e) {
    console.error("Erreur chargement restaurants:", e);
    toast("❌ Impossible de charger les restaurants");
  }
}

function renderRestaurantGrid() {
  const grid = document.getElementById("restaurant-grid");
  const icons = { 3287:"🍽️", 4240:"🍽️", 5523:"🍽️", 5829:"🍽️", 5830:"🍽️" };
  grid.innerHTML = restaurants.map(r => `
    <div class="restaurant-card" onclick="selectRestaurantFromHome(${r.id})">
      <span class="icon">${icons[r.id] || "🏪"}</span>
      ${r.name}
    </div>
  `).join("");
}

function populateRestaurantSelects() {
  const selEntry = document.getElementById("sel-restaurant");
  const selHist  = document.getElementById("hist-restaurant");

  const options = restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join("");
  selEntry.innerHTML = `<option value="">— choisir —</option>` + options;
  selHist.innerHTML  = `<option value="">Tous les restaurants</option>` + options;
}

// ── Select restaurant from Home card ──────────────────────
function selectRestaurantFromHome(restaurantId) {
  selectedRestaurantForEntry = restaurantId;
  // Set the select on entry page
  document.getElementById("sel-restaurant").value = restaurantId;
  onRestaurantChange();
  showPage("entry");
}

// ── Entry page ─────────────────────────────────────────────
async function onRestaurantChange() {
  const sel = document.getElementById("sel-restaurant");
  const rid = parseInt(sel.value);
  const fridgeSel = document.getElementById("sel-fridge");
  const banner = document.getElementById("entry-restaurant-banner");

  // Reset
  fridgeSel.innerHTML = `<option value="">— choisir —</option>`;
  fridgeSel.disabled = true;
  resetTempIndicator();
  updateSubmitBtn();

  if (!rid) {
    banner.style.display = "none";
    return;
  }

  // Show banner
  const r = restaurants.find(x => x.id === rid);
  banner.textContent = `📍 ${r ? r.name : ""}`;
  banner.style.display = "block";

  // Load fridges (with cache)
  try {
    if (!fridgesByRestaurant[rid]) {
      fridgesByRestaurant[rid] = await apiFetch(`/fridges?restaurant_id=${rid}`);
    }
    const fridges = fridgesByRestaurant[rid];
    fridgeSel.innerHTML = `<option value="">— choisir —</option>` +
      fridges.map(f => {
        const typeLabel = f.type === "congelateur" ? "❄️ Congélateur" : "🧊 Frigo";
        return `<option value="${f.id}" data-min="${f.min_temp}" data-max="${f.max_temp}"
                        data-name="${f.name}">
                  ${typeLabel} · ${f.name}
                </option>`;
      }).join("");
    fridgeSel.disabled = false;
  } catch (e) {
    toast("❌ Impossible de charger les frigos");
  }
}

function onFridgeChange() {
  onTempInput();
  updateSubmitBtn();
}

function onTempInput() {
  const temp = parseFloat(document.getElementById("inp-temp").value);
  const fridgeSel = document.getElementById("sel-fridge");
  const opt = fridgeSel.options[fridgeSel.selectedIndex];
  const indicator = document.getElementById("temp-indicator");
  const icon  = document.getElementById("temp-icon");
  const label = document.getElementById("temp-label");

  if (isNaN(temp) || !opt || !opt.value) {
    resetTempIndicator();
    updateSubmitBtn();
    return;
  }

  const min = parseFloat(opt.dataset.min);
  const max = parseFloat(opt.dataset.max);
  const isOk = temp >= min && temp <= max;

  indicator.className = `temp-indicator ${isOk ? "ok" : "warn"}`;
  if (isOk) {
    icon.textContent  = "✅";
    label.textContent = `${temp}°C — Température conforme (plage ${min}°C à ${max}°C)`;
  } else {
    icon.textContent  = "⚠️";
    label.textContent = `${temp}°C — HORS PLAGE ! (plage ${min}°C à ${max}°C)`;
  }

  updateSubmitBtn();
}

function resetTempIndicator() {
  const indicator = document.getElementById("temp-indicator");
  document.getElementById("temp-icon").textContent  = "—";
  document.getElementById("temp-label").textContent = "Saisissez la température";
  indicator.className = "temp-indicator idle";
}

function updateSubmitBtn() {
  const rid      = document.getElementById("sel-restaurant").value;
  const fridge   = document.getElementById("sel-fridge").value;
  const employee = document.getElementById("inp-employee").value;
  const temp     = document.getElementById("inp-temp").value;
  const btn      = document.getElementById("btn-submit");
  btn.disabled   = !(rid && fridge && employee && temp !== "");
}

async function submitRecord() {
  const fridgeSel  = document.getElementById("sel-fridge");
  const opt        = fridgeSel.options[fridgeSel.selectedIndex];
  const temp       = parseFloat(document.getElementById("inp-temp").value);
  const min        = parseFloat(opt.dataset.min);
  const max        = parseFloat(opt.dataset.max);

  const payload = {
    restaurant_id: parseInt(document.getElementById("sel-restaurant").value),
    fridge_id:     parseInt(fridgeSel.value),
    fridge_name:   opt.dataset.name,
    employee_name: document.getElementById("inp-employee").value,
    temperature:   temp,
    is_ok:         temp >= min && temp <= max,
  };

  const btn = document.getElementById("btn-submit");
  btn.disabled = true;
  btn.textContent = "⏳ Enregistrement…";

  try {
    await apiPost("/records", payload);
    toast("✅ Relevé enregistré avec succès !");
    // Reset form (keep restaurant)
    fridgeSel.selectedIndex = 0;
    document.getElementById("inp-temp").value = "";
    document.getElementById("inp-employee").selectedIndex = 0;
    resetTempIndicator();
  } catch (e) {
    toast("❌ Erreur lors de l'enregistrement");
  } finally {
    btn.disabled = false;
    btn.textContent = "✅ Valider le relevé";
    updateSubmitBtn();
  }
}

// ── History page ───────────────────────────────────────────
async function loadHistory() {
  const rid  = document.getElementById("hist-restaurant").value;
  const date = document.getElementById("hist-date").value;
  const container = document.getElementById("history-content");

  container.innerHTML = `<p class="empty-state">⏳ Chargement…</p>`;

  try {
    let url = `/records?date=${date || new Date().toISOString().slice(0,10)}`;
    if (rid) url += `&restaurant_id=${rid}`;
    const records = await apiFetch(url);

    if (!records.length) {
      container.innerHTML = `<p class="empty-state">Aucun relevé pour cette sélection.</p>`;
      return;
    }

    // Group by restaurant for display
    const byRestaurant = {};
    records.forEach(r => {
      const key = r.restaurant_id;
      if (!byRestaurant[key]) byRestaurant[key] = [];
      byRestaurant[key].push(r);
    });

    let html = "";
    for (const [restaurantId, rows] of Object.entries(byRestaurant)) {
      const restName = restaurants.find(x => x.id === parseInt(restaurantId))?.name || restaurantId;
      html += `<h3 style="margin:20px 0 10px;color:#1a6bcc;">📍 ${restName}</h3>`;
      html += `<div class="table-wrapper"><table>
        <thead>
          <tr>
            <th>Heure</th>
            <th>Employé</th>
            <th>Frigo</th>
            <th>Temp.</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>`;

      rows.forEach(r => {
        const dt   = new Date(r.created_at + (r.created_at.includes("Z") ? "" : "Z"));
        const time = dt.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });
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
  } catch (e) {
    container.innerHTML = `<p class="empty-state">❌ Erreur de chargement.</p>`;
    console.error(e);
  }
}

// ── Toast ──────────────────────────────────────────────────
function toast(msg, duration = 3000) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), duration);
}
