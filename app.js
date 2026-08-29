(() => {
  "use strict";

  // Conservamos la misma clave de V0.1 para no perder entrenamientos existentes.
  const CHECKINS_KEY = "entreno-v01-checkins";
  const POINTS_KEY = "entreno-v02-points";
  const AWARDS_KEY = "entreno-v02-awarded-weeks";
  const WEEKLY_GOAL = 3;
  const WEEKLY_REWARD = 100;

  const $ = (selector) => document.querySelector(selector);

  const streakCount = $("#streakCount");
  const streakUnit = $("#streakUnit");
  const streakMessage = $("#streakMessage");
  const pointsBalance = $("#pointsBalance");
  const weeklyProgress = $("#weeklyProgress");
  const weeklyReward = $("#weeklyReward");
  const weeklyMessage = $("#weeklyMessage");
  const goalSegments = $("#goalSegments");
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

  function startOfWeek(date = new Date()) {
    const copy = new Date(date);
    copy.setHours(12, 0, 0, 0);
    const daysSinceMonday = (copy.getDay() + 6) % 7;
    return addDays(copy, -daysSinceMonday);
  }

  function currentWeekKey(date = new Date()) {
    return localDateKey(startOfWeek(date));
  }

  function loadCheckins() {
    try {
      const raw = JSON.parse(localStorage.getItem(CHECKINS_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return [...new Set(raw.filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)))].sort();
    } catch {
      return [];
    }
  }

  function saveCheckins(items) {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(items));
  }

  function loadPoints() {
    const parsed = Number.parseInt(localStorage.getItem(POINTS_KEY) || "0", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  function savePoints(value) {
    localStorage.setItem(POINTS_KEY, String(Math.max(0, Math.floor(value))));
  }

  function loadAwardedWeeks() {
    try {
      const raw = JSON.parse(localStorage.getItem(AWARDS_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return [...new Set(raw.filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)))].sort();
    } catch {
      return [];
    }
  }

  function saveAwardedWeeks(items) {
    localStorage.setItem(AWARDS_KEY, JSON.stringify(items));
  }

  function getCurrentWeekCheckins(checkins, date = new Date()) {
    const start = startOfWeek(date);
    const end = addDays(start, 6);
    const startKey = localDateKey(start);
    const endKey = localDateKey(end);
    return checkins.filter((key) => key >= startKey && key <= endKey);
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

  function awardCurrentWeekIfEligible(checkins) {
    const progress = getCurrentWeekCheckins(checkins).length;
    if (progress < WEEKLY_GOAL) return 0;

    const weekKey = currentWeekKey();
    const awardedWeeks = loadAwardedWeeks();
    if (awardedWeeks.includes(weekKey)) return 0;

    awardedWeeks.push(weekKey);
    awardedWeeks.sort();
    saveAwardedWeeks(awardedWeeks);
    savePoints(loadPoints() + WEEKLY_REWARD);
    return WEEKLY_REWARD;
  }

  function formatLongDate(date) {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(date);
  }

  function renderGoal(checkins) {
    const progress = getCurrentWeekCheckins(checkins).length;
    const cappedProgress = Math.min(progress, WEEKLY_GOAL);
    const awarded = loadAwardedWeeks().includes(currentWeekKey());
    const remaining = Math.max(WEEKLY_GOAL - progress, 0);

    pointsBalance.textContent = String(loadPoints());
    weeklyProgress.textContent = `${cappedProgress} / ${WEEKLY_GOAL}`;
    weeklyReward.textContent = awarded ? "Recompensa obtenida ✓" : `+${WEEKLY_REWARD} pts al completar`;

    goalSegments.innerHTML = Array.from({ length: WEEKLY_GOAL }, (_, index) => {
      const filled = index < cappedProgress;
      return `<span class="goal-segment${filled ? " filled" : ""}" aria-hidden="true"></span>`;
    }).join("");

    goalSegments.setAttribute(
      "aria-label",
      `${cappedProgress} de ${WEEKLY_GOAL} entrenamientos completados esta semana`
    );

    if (remaining === 0) {
      weeklyMessage.textContent = "Semana cumplida. Tu constancia ya generó puntos.";
    } else if (remaining === 1) {
      weeklyMessage.textContent = "Te falta 1 entrenamiento para completar la semana.";
    } else {
      weeklyMessage.textContent = `Te faltan ${remaining} entrenamientos para completar la semana.`;
    }
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
      const dow = new Intl.DateTimeFormat("es-AR", { weekday: "short" })
        .format(date)
        .replace(".", "");

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
    const rewardGained = awardCurrentWeekIfEligible(checkins);
    const today = new Date();
    const todayKey = localDateKey(today);
    const doneToday = checkins.includes(todayKey);
    const streak = calculateStreak(checkins);

    todayLabel.textContent = formatLongDate(today);
    todayBadge.textContent = doneToday ? "Completado" : "Pendiente";
    todayBadge.classList.toggle("done", doneToday);

    streakCount.textContent = String(streak);
    streakUnit.textContent = streak === 1 ? "día" : "días";

    if (streak === 0) streakMessage.textContent = "Registrá tu próximo entrenamiento.";
    else if (streak === 1) streakMessage.textContent = "Primer día. La racha ya empezó.";
    else streakMessage.textContent = `${streak} días seguidos. Seguí construyendo constancia.`;

    trainButton.disabled = doneToday;
    trainButton.innerHTML = doneToday
      ? "<span>ENTRENAMIENTO REGISTRADO</span><span aria-hidden='true'>✓</span>"
      : "<span>ENTRENÉ HOY</span><span aria-hidden='true'>＋</span>";

    totalCount.textContent = `${checkins.length} ${checkins.length === 1 ? "entrenamiento" : "entrenamientos"}`;

    renderGoal(checkins);
    renderWeek(checkins);

    feedback.textContent = rewardGained
      ? `Objetivo semanal cumplido. +${rewardGained} puntos. ⭐`
      : message;
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
    const confirmed = window.confirm("¿Borrar entrenamientos, objetivos cumplidos y puntos de este dispositivo?");
    if (!confirmed) return;

    localStorage.removeItem(CHECKINS_KEY);
    localStorage.removeItem(POINTS_KEY);
    localStorage.removeItem(AWARDS_KEY);
    render("Datos de prueba eliminados.");
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }

  render();
})();
