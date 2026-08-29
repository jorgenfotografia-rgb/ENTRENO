(() => {
  "use strict";

  const STORAGE_KEY = "entreno-v01-checkins";
  const $ = (selector) => document.querySelector(selector);

  const streakCount = $("#streakCount");
  const streakUnit = $("#streakUnit");
  const streakMessage = $("#streakMessage");
  const todayLabel = $("#todayLabel");
  const todayBadge = $("#todayBadge");
  const trainButton = $("#trainButton");
  const feedback = $("#feedback");
  const weekGrid = $("#weekGrid");
  const totalCount = $("#totalCount");
  const resetButton = $("#resetButton");

  const pad = (n) => String(n).padStart(2, "0");

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function addDays(date, amount) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
  }

  function loadCheckins() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return [...new Set(raw.filter((v) => /^\d{4}-\d{2}-\d{2}$/.test(v)))].sort();
    } catch {
      return [];
    }
  }

  function saveCheckins(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function calculateStreak(checkins) {
    const set = new Set(checkins);
    const now = new Date();
    const today = localDateKey(now);
    const yesterdayDate = addDays(now, -1);
    const yesterday = localDateKey(yesterdayDate);
    let cursor;
    if (set.has(today)) cursor = now;
    else if (set.has(yesterday)) cursor = yesterdayDate;
    else return 0;

    let count = 0;
    while (set.has(localDateKey(cursor))) {
      count += 1;
      cursor = addDays(cursor, -1);
      if (count > 3660) break;
    }
    return count;
  }

  function formatLongDate(date) {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(date);
  }

  function renderWeek(checkins) {
    const set = new Set(checkins);
    const today = new Date();
    const cells = [];

    for (let offset = -6; offset <= 0; offset += 1) {
      const date = addDays(today, offset);
      const key = localDateKey(date);
      const done = set.has(key);
      const isToday = offset === 0;
      const dow = new Intl.DateTimeFormat("es-AR", { weekday: "short" }).format(date).replace(".", "");

      cells.push(`
        <div class="day-cell${done ? " done" : ""}${isToday ? " today" : ""}"
             aria-label="${formatLongDate(date)}: ${done ? "entrenamiento registrado" : "sin entrenamiento"}">
          <span class="dow">${dow}</span>
          <span class="date-num">${date.getDate()}</span>
        </div>
      `);
    }

    weekGrid.innerHTML = cells.join("");
  }

  function render(message = "") {
    const checkins = loadCheckins();
    const today = new Date();
    const todayKey = localDateKey(today);
    const doneToday = checkins.includes(todayKey);
    const streak = calculateStreak(checkins);

    todayLabel.textContent = formatLongDate(today);
    todayBadge.textContent = doneToday ? "Completado" : "Pendiente";
    todayBadge.classList.toggle("done", doneToday);

    streakCount.textContent = String(streak);
    streakUnit.textContent = streak === 1 ? "día" : "días";

    if (streak === 0) streakMessage.textContent = "Registrá tu primer entrenamiento.";
    else if (streak === 1) streakMessage.textContent = "Primer día. La racha ya empezó.";
    else streakMessage.textContent = `${streak} días seguidos. Seguí construyendo constancia.`;

    trainButton.disabled = doneToday;
    trainButton.innerHTML = doneToday
      ? "<span>ENTRENAMIENTO REGISTRADO</span><span aria-hidden='true'>✓</span>"
      : "<span>ENTRENÉ HOY</span><span aria-hidden='true'>＋</span>";

    totalCount.textContent = `${checkins.length} ${checkins.length === 1 ? "entrenamiento" : "entrenamientos"}`;
    feedback.textContent = message;
    renderWeek(checkins);
  }

  trainButton.addEventListener("click", () => {
    const checkins = loadCheckins();
    const todayKey = localDateKey();
    if (!checkins.includes(todayKey)) {
      checkins.push(todayKey);
      checkins.sort();
      saveCheckins(checkins);
      render("Entrenamiento de hoy registrado. 🔥");
    } else {
      render("Ya registraste el entrenamiento de hoy.");
    }
  });

  resetButton.addEventListener("click", () => {
    const confirmed = window.confirm("¿Borrar todos los datos guardados en este dispositivo?");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    render("Datos de prueba eliminados.");
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }

  render();
})();
