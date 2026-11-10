const gridEl = document.getElementById("camera-grid");
const emptyEl = document.getElementById("empty");
const statusEl = document.getElementById("status");
const gridView = document.getElementById("grid-view");
const detailView = document.getElementById("detail-view");
const detailTitle = document.getElementById("detail-title");
const detailImage = document.getElementById("detail-image");
const detailMeta = document.getElementById("detail-meta");
const detailActions = document.getElementById("detail-actions");

let refreshSeconds = 5;
let timer = null;
let selected = null;
let cameras = [];

function bust(url) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
}

function proxyUrl(entityId) {
  return bust(`api/camera_proxy/${encodeURIComponent(entityId)}`);
}

function setStatus(text) {
  statusEl.textContent = text;
}

async function loadConfig() {
  const res = await fetch("api/config");
  if (!res.ok) throw new Error(`config ${res.status}`);
  const data = await res.json();
  refreshSeconds = data.refresh_seconds || 5;
}

async function loadCameras() {
  const res = await fetch("api/cameras");
  if (!res.ok) throw new Error(`cameras ${res.status}`);
  const data = await res.json();
  cameras = data.cameras || [];
  return cameras;
}

function renderGrid() {
  gridEl.innerHTML = "";
  emptyEl.classList.toggle("hidden", cameras.length > 0);

  for (const cam of cameras) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card";
    btn.setAttribute("role", "listitem");
    btn.addEventListener("click", () => openDetail(cam.entity_id));

    const img = document.createElement("img");
    img.alt = cam.friendly_name;
    img.loading = "lazy";
    img.src = proxyUrl(cam.entity_id);
    img.onerror = () => {
      img.replaceWith(Object.assign(document.createElement("div"), {
        className: "card-body",
        textContent: "Preview unavailable",
        style: "aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;color:var(--muted)",
      }));
    };

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `
      <p class="card-title">${escapeHtml(cam.friendly_name)}</p>
      <p class="card-meta">
        <span class="state-dot ${escapeHtml(cam.state || "")}"></span>
        ${escapeHtml(cam.state || "unknown")} · ${escapeHtml(cam.entity_id)}
      </p>
    `;

    btn.append(img, body);
    gridEl.append(btn);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function openDetail(entityId) {
  selected = cameras.find((c) => c.entity_id === entityId) || null;
  if (!selected) return;

  gridView.classList.add("hidden");
  detailView.classList.remove("hidden");
  detailView.hidden = false;

  detailTitle.textContent = selected.friendly_name;
  detailImage.src = proxyUrl(selected.entity_id);

  detailMeta.innerHTML = `
    <dt>Entity</dt><dd>${escapeHtml(selected.entity_id)}</dd>
    <dt>State</dt><dd>${escapeHtml(selected.state || "unknown")}</dd>
    <dt>Brand</dt><dd>${escapeHtml(selected.brand || "—")}</dd>
    <dt>Model</dt><dd>${escapeHtml(selected.model || "—")}</dd>
  `;

  detailActions.innerHTML = "";
  const actions = [
    ["turn_on", "Turn on"],
    ["turn_off", "Turn off"],
    ["snapshot", "Snapshot"],
  ];
  for (const [service, label] of actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn primary";
    button.textContent = label;
    button.addEventListener("click", () => callService(service));
    detailActions.append(button);
  }
}

function closeDetail() {
  selected = null;
  detailView.classList.add("hidden");
  detailView.hidden = true;
  gridView.classList.remove("hidden");
}

async function callService(service) {
  if (!selected) return;
  setStatus(`Calling ${service}…`);
  const res = await fetch("api/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "camera",
      service,
      entity_id: selected.entity_id,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    setStatus(`Failed: ${text}`);
    return;
  }
  setStatus(`${service} ok`);
  await refresh();
  if (selected) openDetail(selected.entity_id);
}

async function refresh() {
  try {
    await loadCameras();
    if (selected) {
      const still = cameras.find((c) => c.entity_id === selected.entity_id);
      if (still) {
        selected = still;
        detailImage.src = proxyUrl(selected.entity_id);
        detailMeta.querySelectorAll("dd")[1].textContent = selected.state || "unknown";
      } else {
        closeDetail();
        renderGrid();
      }
    } else {
      renderGrid();
    }
    setStatus(`${cameras.length} camera${cameras.length === 1 ? "" : "s"} · ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
  }
}

function schedule() {
  if (timer) clearInterval(timer);
  timer = setInterval(refresh, refreshSeconds * 1000);
}

document.getElementById("refresh-btn").addEventListener("click", refresh);
document.getElementById("back-btn").addEventListener("click", () => {
  closeDetail();
  renderGrid();
});

(async function init() {
  try {
    await loadConfig();
    await refresh();
    schedule();
  } catch (err) {
    setStatus(`Startup error: ${err.message}`);
  }
})();
