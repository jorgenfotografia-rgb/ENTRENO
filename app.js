(() => {
  "use strict";

  const CHECKINS_KEY = "entreno-v01-checkins";
  const POINTS_KEY = "entreno-v02-points";
  const AWARDS_KEY = "entreno-v02-awarded-weeks";
  const GOAL_KEY = "entreno-v03-weekly-goal";
  const WEEKLY_REWARD = 100;
  const MIN_GOAL = 2;
  const MAX_GOAL = 6;

  const $ = (selector) => document.querySelector(selector);

  const onboarding = $("#onboarding");
  const appShell = $("#appShell");
  const onboardingTitle = $("#onboardingTitle");
  const onboardingLead = $("#onboardingLead");
  const goalForm = $("#goalForm");
  const goalSubmit = $("#goalSubmit");
  const goalInputs = [...document.querySelectorAll('input[name="weeklyGoal"]')];

  const streakCount = $("#streakCount");
  const streakUnit = $("#streakUnit");
  const streakMessage = $("#streakMessage");
  const goalTitle = $("#goalTitle");
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
  const changeGoalButton = $("#changeGoalButton");
  const resetButton = $("#resetButton");

  const pad = (n) => String(n).padStart(2, "0");

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function dateFromKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
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

  function loadGoal() {
    const value = Number.parseInt(localStorage.getItem(GOAL_KEY) || "", 10);
    return Number.isInteger(value) && value >= MIN_GOAL && value <= MAX_GOAL ? value : null;
  }

  function saveGoal(value) {
    const safe = Math.min(MAX_GOAL, Math.max(MIN_GOAL, Math.floor(value)));
    localStorage.setItem(GOAL_KEY, String(safe));
    return safe;
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

  function calculateWeeklyStreak(awardedWeeks) {
    const set = new Set(awardedWeeks);
    const thisWeek = startOfWeek(new Date());
    const previousWeek = addDays(thisWeek, -7);

    let cursor;
    if (set.has(localDateKey(thisWeek))) cursor = thisWeek;
    else if (set.has(localDateKey(previousWeek))) cursor = previousWeek;
    else return 0;

    let count = 0;
    while (set.has(localDateKey(cursor))) {
      count += 1;
      cursor = addDays(cursor, -7);
      if (count > 520) break;
    }
    return count;
  }

  function awardCurrentWeekIfEligible(checkins, goal) {
    const progress = getCurrentWeekCheckins(checkins).length;
    if (progress < goal) return 0;

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

  function renderGoal(checkins, goal) {
    const progress = getCurrentWeekCheckins(checkins).length;
    const cappedProgress = Math.min(progress, goal);
    const awarded = loadAwardedWeeks().includes(currentWeekKey());
    const remaining = Math.max(goal - progress, 0);

    goalTitle.textContent = `${goal} ${goal === 1 ? "entrenamiento" : "entrenamientos"}`;
    pointsBalance.textContent = String(loadPoints());
    weeklyProgress.textContent = `${cappedProgress} / ${goal}`;
    weeklyReward.textContent = awarded ? "Recompensa obtenida ✓" : `+${WEEKLY_REWARD} pts al completar`;

    goalSegments.style.setProperty("--goal-count", String(goal));
    goalSegments.innerHTML = Array.from({ length: goal }, (_, index) => {
      const filled = index < cappedProgress;
      return `<span class="goal-segment${filled ? " filled" : ""}" aria-hidden="true"></span>`;
    }).join("");

    goalSegments.setAttribute(
      "aria-label",
      `${cappedProgress} de ${goal} entrenamientos completados esta semana`
    );

    if (remaining === 0) {
      weeklyMessage.textContent = "Semana cumplida. Cumpliste lo que te propusiste.";
    } else if (remaining === 1) {
      weeklyMessage.textContent = "Te falta 1 entrenamiento para cumplir tu objetivo.";
    } else {
      weeklyMessage.textContent = `Te faltan ${remaining} entrenamientos para cumplir tu objetivo.`;
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

  function showOnboarding(editing = false) {
    const currentGoal = loadGoal();
    appShell.hidden = true;
    onboarding.hidden = false;
    onboarding.dataset.mode = editing ? "edit" : "first";

    onboardingTitle.textContent = editing
      ? "¿Cuántas veces querés entrenar por semana?"
      : "¿Cuántas veces querés entrenar por semana?";

    onboardingLead.textContent = editing
      ? "Ajustá tu compromiso a una frecuencia que puedas sostener."
      : "Elegí un objetivo que puedas sostener. Descansar también forma parte del entrenamiento.";

    goalInputs.forEach((input) => {
      input.checked = currentGoal !== null && Number(input.value) === currentGoal;
    });

    goalSubmit.disabled = currentGoal === null;
    goalSubmit.querySelector("span:first-child").textContent = editing ? "GUARDAR OBJETIVO" : "COMENZAR";
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function showApp(message = "") {
    onboarding.hidden = true;
    appShell.hidden = false;
    render(message);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function render(message = "") {
    const goal = loadGoal();
    if (goal === null) {
      showOnboarding(false);
      return;
    }

    const checkins = loadCheckins();
    const rewardGained = awardCurrentWeekIfEligible(checkins, goal);
    const today = new Date();
    const todayKey = localDateKey(today);
    const doneToday = checkins.includes(todayKey);
    const weeklyStreak = calculateWeeklyStreak(loadAwardedWeeks());

    todayLabel.textContent = formatLongDate(today);
    todayBadge.textContent = doneToday ? "Completado" : "Pendiente";
    todayBadge.classList.toggle("done", doneToday);

    streakCount.textContent = String(weeklyStreak);
    streakUnit.textContent = weeklyStreak === 1 ? "semana" : "semanas";

    if (weeklyStreak === 0) {
      streakMessage.textContent = "Tu racha empieza cuando completes tu primer objetivo semanal.";
    } else if (weeklyStreak === 1) {
      streakMessage.textContent = "Primera semana cumplida. Tu racha de constancia empezó.";
    } else {
      streakMessage.textContent = `${weeklyStreak} semanas cumpliendo lo que te propusiste.`;
    }

    trainButton.disabled = doneToday;
    trainButton.innerHTML = doneToday
      ? "<span>ENTRENAMIENTO REGISTRADO</span><span aria-hidden='true'>✓</span>"
      : "<span>ENTRENÉ HOY</span><span aria-hidden='true'>＋</span>";

    totalCount.textContent = `${checkins.length} ${checkins.length === 1 ? "entrenamiento" : "entrenamientos"}`;

    renderGoal(checkins, goal);
    renderWeek(checkins);

    feedback.textContent = rewardGained
      ? `Objetivo semanal cumplido. +${rewardGained} puntos. ⭐`
      : message;
  }

  goalInputs.forEach((input) => {
    input.addEventListener("change", () => {
      goalSubmit.disabled = false;
    });
  });

  goalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = goalInputs.find((input) => input.checked);
    if (!selected) return;

    const editing = onboarding.dataset.mode === "edit";
    const goal = saveGoal(Number(selected.value));
    showApp(editing
      ? `Objetivo actualizado: ${goal} entrenamientos por semana.`
      : `Tu compromiso empieza con ${goal} entrenamientos por semana.`
    );
  });

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

  changeGoalButton.addEventListener("click", () => {
    showOnboarding(true);
  });

  resetButton.addEventListener("click", () => {
    const confirmed = window.confirm("¿Borrar objetivo, entrenamientos, semanas cumplidas y puntos de este dispositivo?");
    if (!confirmed) return;

    localStorage.removeItem(CHECKINS_KEY);
    localStorage.removeItem(POINTS_KEY);
    localStorage.removeItem(AWARDS_KEY);
    localStorage.removeItem(GOAL_KEY);
    showOnboarding(false);
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }

  if (loadGoal() === null) showOnboarding(false);
  else showApp();
})();
