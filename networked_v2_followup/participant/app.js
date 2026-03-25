/* ============================================================
   AI Judgment Micro-Intervention Follow-up Lean-30 — Networked Participant Client
   Adapted from single-machine prototype with WebSocket integration
   ============================================================ */

const { LANG, T } = window.ParticipantI18n;
const LABEL_JOINER = LANG === "en" ? ", " : "、";

// ── State ──
const S = {
  materials: null,
  participantId: "",
  stage: "loading",
  pretestIndex: 0,
  posttestIndex: 0,
  sceneIndex: 0,
  pretestResponses: [],
  posttestResponses: [],
  sceneResponses: [],
  interviewResponses: {},
  interactionPattern: { primary: "", secondary: "", note: "" },
  operatorNotes: [],
  profileOverride: false,
  pretestStartedAt: null,
  posttestStartedAt: null,
  currentItemStartedAt: null,
  sessionStartedAt: null,
  selectedProfiles: [],
  profileRecommendation: null,
  posttestItemOrder: [],
  errors: "",
  awaitingStart: false
};

const STAGES = ["consent","warmup","pretest","profile","scenes","transition","posttest","interview","debrief"];
const CONNECT_TIMEOUT_MS = 3000;

const categoryToProfile = {
  "hallucinated-citation": "hallucination-weak",
  "source-verification": "verification-weak",
  "trust-calibration": "trust-calibration-weak",
  "scope-generalization": "scope-generalization-weak"
};
const profileToCategory = Object.fromEntries(Object.entries(categoryToProfile).map(([k,v]) => [v,k]));
const CATEGORY_TIEBREAK_PRIORITY = {
  "scope-generalization": 0,
  "source-verification": 1,
  "trust-calibration": 2,
  "hallucinated-citation": 3
};

const catLabel = T.cat_label;
const profileLabel = T.profile_label;

function localizedCandidates(base) {
  return LANG === "en"
    ? [`${base}_en`, `${base}_zh`, base]
    : [`${base}_zh`, `${base}_en`, base];
}

function localizedValue(record, base, fallback = "") {
  if (!record) return fallback;
  for (const key of localizedCandidates(base)) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return fallback;
}

function formatDisplayItemId(id) {
  if (!id) return T.item_prefix_generic;
  const match = /^(?:V2_)?(PRE|POST)_([A-Z]\d+)$/.exec(id);
  if (!match) return id === "PRE_UNKNOWN" ? T.item_prefix_generic : id;
  const prefix = match[1] === "PRE" ? T.item_prefix_pretest : T.item_prefix_posttest;
  return `${prefix} ${match[2]}`;
}

function formatSceneLabel(index) {
  return `${T.scene_prefix} ${index + 1}`;
}

// ── DOM refs ──
const $screen = document.getElementById("screen");
const $badge = document.getElementById("session-badge");
const $timer = document.getElementById("timer");
const $progress = document.getElementById("progress-bar");
const $progressFill = document.getElementById("progress-fill");
const $connDot = document.querySelector("#conn-indicator .conn-dot");
const $connText = document.getElementById("conn-text");
const $toastContainer = document.getElementById("toast-container");
const radioTpl = document.getElementById("radio-group-template");

// ── Timer ──
let timerInterval = null;
let connectTimeout = null;
function startTimer() {
  S.currentItemStartedAt = Date.now();
  $timer.hidden = false;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}
function updateTimer() {
  if (!S.currentItemStartedAt) return;
  const elapsed = Math.floor((Date.now() - S.currentItemStartedAt) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  $timer.textContent = `${m}:${s}`;
}
function stopTimer() { clearInterval(timerInterval); $timer.hidden = true; }

function clearConnectTimeout() {
  clearTimeout(connectTimeout);
  connectTimeout = null;
}

function failStartupConnection(message) {
  clearConnectTimeout();
  S.awaitingStart = false;
  WS.disconnect();
  S.errors = message;
  S.stage = "connection_error";
  setConnStatus(false);
  render();
}

// ── Progress ──
function updateProgress() {
  const idx = STAGES.indexOf(S.stage);
  if (idx < 0) { $progress.hidden = true; return; }
  $progress.hidden = false;
  const pct = ((idx + 1) / STAGES.length * 100).toFixed(0);
  $progressFill.style.width = pct + "%";
}

// ── Connection indicator ──
function setConnStatus(online) {
  $connDot.className = "conn-dot " + (online ? "online" : "offline");
  $connText.textContent = online ? T.conn_connected : T.conn_disconnected;
  const indicator = document.getElementById("conn-indicator");
  indicator.title = $connText.textContent;
  indicator.setAttribute("aria-label", $connText.textContent);
}

// ── Toast ──
function showToast(text, type) {
  const t = el("div", "toast " + (type || ""));
  t.textContent = text;
  $toastContainer.append(t);
  setTimeout(() => t.remove(), 6000);
}

// ── WS message handler ──
function onWsMessage(msg) {
  switch (msg.type) {
    case "joined":
      clearConnectTimeout();
      S.materials = msg.materials;
      // Restore session if reconnecting
      if (msg.session && msg.session.currentStage && msg.session.currentStage !== "consent") {
        restoreSession(msg.session);
      } else if (S.awaitingStart) {
        S.awaitingStart = false;
        S.stage = "warmup";
        reportStage("warmup", 0, 0);
      } else {
        S.stage = "consent";
      }
      setConnStatus(true);
      render();
      break;

    case "profile_approved":
      S.selectedProfiles = msg.selectedProfiles;
      S.profileOverride = msg.overrideNote || false;
      S.stage = "scenes";
      S.sceneIndex = 0;
      S.sceneResponses = [];
      startTimer();
      reportStage("scenes", 0, getSelectedScenes().length);
      render();
      break;

    case "nudge":
      showToast(T.toast_nudge_prefix + msg.message, "");
      break;

    case "interview_complete":
      S.stage = "debrief";
      reportStage("debrief", 0, 0);
      render();
      break;

    case "_disconnected":
      if (S.awaitingStart && !S.materials) {
        failStartupConnection(T.startup_fail_handshake);
      } else {
        setConnStatus(false);
        showToast(T.toast_reconnecting, "info");
      }
      break;

    case "error":
      showToast(T.toast_error_prefix + msg.message, "");
      break;
  }
}

function restoreSession(sess) {
  if (sess.pretestResponses) S.pretestResponses = sess.pretestResponses;
  if (sess.posttestResponses) S.posttestResponses = sess.posttestResponses;
  if (sess.sceneResponses) S.sceneResponses = sess.sceneResponses;
  if (sess.selectedProfiles) S.selectedProfiles = sess.selectedProfiles;
  if (sess.profileRecommendation) S.profileRecommendation = sess.profileRecommendation;
  S.pretestIndex = S.pretestResponses.length;
  S.posttestIndex = S.posttestResponses.length;
  S.sceneIndex = S.sceneResponses.length;

  const stage = sess.currentStage;
  if (stage === "profile_waiting") {
    S.stage = "profile_waiting";
  } else if (STAGES.includes(stage)) {
    S.stage = stage;
  } else {
    S.stage = "consent";
  }
}

// ── WS reporting helpers ──
function reportStage(stage, index, total) {
  WS.send({ type: "stage_change", participantId: S.participantId, stage, stageIndex: index, stageTotal: total });
}

function reportResponse(phase, response) {
  WS.send({ type: "response", participantId: S.participantId, phase, response });
}

// ── Bootstrap ──
// Show consent first — connection happens after PID is entered
S.stage = "consent";
render();

// ── Master render ──
function render() {
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
  const renderers = {
    consent: renderConsent,
    warmup: renderWarmup,
    pretest: renderItemScreen.bind(null, "pretest"),
    profile: renderProfile,
    profile_waiting: renderProfileWaiting,
    scenes: renderScene,
    transition: renderTransition,
    posttest: renderItemScreen.bind(null, "posttest"),
    interview: renderInterviewWaiting,
    debrief: renderDebrief,
    connection_error: renderError
  };
  const fn = renderers[S.stage];
  if (fn) {
    $badge.textContent = badgeText();
    fn();
  } else {
    renderError();
  }
}

function badgeText() {
  switch (S.stage) {
    case "consent":
      return T.badge_welcome;
    case "warmup":
      return T.badge_warmup;
    case "pretest":
      return `${T.badge_pretest} ${S.pretestIndex + 1}/${getItems("pretest").length}`;
    case "profile":
      return T.badge_profile;
    case "profile_waiting":
      return T.badge_profile_waiting;
    case "scenes":
      return `${T.badge_scene} ${S.sceneIndex + 1}/${getSelectedScenes().length}`;
    case "transition":
      return T.badge_transition;
    case "posttest":
      return `${T.badge_posttest} ${S.posttestIndex + 1}/${getPosttestOrder().length}`;
    case "interview":
      return T.badge_interview;
    case "debrief":
      return T.badge_debrief;
    case "connection_error":
      return T.badge_connection_error;
    default:
      return S.stage;
  }
}

// ── Consent Screen ──
function renderConsent() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card(T.consent_title, `
    <p>${T.consent_intro}</p>
    <p>${T.consent_task}</p>
  `));

  const pillHtml = T.consent_pills.map((label, index) => `<span class="pill${index === 0 ? " active" : ""}">${esc(label)}</span>`).join("");
  w.append(card(T.consent_flow_title, `
    <div class="pill-row">
      ${pillHtml}
    </div>
    <p class="helper-text" style="margin-top:12px">${T.consent_duration}</p>
  `));

  const infoHtml = T.consent_info.map((text, index) => `
    <div class="consent-item"><div class="consent-icon">${index + 1}</div><div>${text}</div></div>
  `).join("");
  w.append(card(T.consent_info_title, `<div class="consent-grid">${infoHtml}</div>`));

  const setupCard = el("div", "card field-stack");
  setupCard.innerHTML = `
    <h2 class="card-title">${esc(T.consent_setup_title)}</h2>
    <label for="pid">${esc(T.consent_pid_label)}</label>
    <input id="pid" type="text" placeholder="${escAttr(T.consent_pid_placeholder)}" value="${esc(S.participantId)}" />
    <p class="helper-text compact">${T.consent_pid_help}</p>
  `;
  w.append(setupCard);

  const btns = el("div", "button-row");
  btns.append(btn(T.consent_btn, "primary", () => {
    const v = document.getElementById("pid").value.trim();
    if (!v) { alert(T.consent_pid_alert); return; }
    S.participantId = v;
    S.sessionStartedAt = Date.now();
    S.awaitingStart = true;

    // Connect to server
    WS.connect(v, LANG, onWsMessage);

    // Show loading while connecting
    $screen.innerHTML = `<div class="waiting-overlay"><div class="spinner"></div><p>${esc(T.waiting_server)}</p></div>`;

    clearConnectTimeout();
    connectTimeout = setTimeout(() => {
      if (S.awaitingStart && !S.materials) {
        failStartupConnection(T.startup_fail_timeout);
      }
    }, CONNECT_TIMEOUT_MS);
  }));
  w.append(btns);
  $screen.append(w);
}

// ── Warm-up Screen ──
function renderWarmup() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card(T.warmup_title, `<p>${T.warmup_intro}</p>`));

  w.append(contextCard("goal", T.warmup_goal_title, `
    <div class="answer-box">${T.warmup_goal}</div>
  `));

  w.append(contextCard("ai", T.warmup_ai_title, `
    <div class="answer-box">${T.warmup_ai}</div>
  `));

  const warmupBullets = T.warmup_ev_bullets.map((bullet) => `<li>${bullet}</li>`).join("");
  w.append(contextCard("fact", T.warmup_ev_title, `
    <div class="answer-box">
      <ul class="list-tight">${warmupBullets}</ul>
    </div>
  `));

  const warmupSteps = T.warmup_steps.map((step) => `<li>${step}</li>`).join("");
  w.append(card(T.warmup_explain_title, `
    <div class="callout">
      <p>${T.warmup_judgment}</p>
      <p>${T.warmup_reason}</p>
      <p>${T.warmup_next_action}</p>
    </div>
    <div style="margin-top:14px">
      <strong>${esc(T.warmup_steps_label)}</strong>
      <ol class="list-tight" style="padding-left:20px;margin-top:8px;">${warmupSteps}</ol>
    </div>
  `));

  const warmupActions = T.warmup_actions.map(([icon, text]) => `
    <div class="consent-item"><div class="consent-icon">${icon}</div><div>${text}</div></div>
  `).join("");
  w.append(card(T.warmup_actions_title, `<div class="consent-grid">${warmupActions}</div>`));

  const btns = el("div", "button-row");
  btns.append(btn(T.warmup_btn, "primary", () => {
    S.stage = "pretest";
    S.pretestIndex = 0;
    S.pretestResponses = [];
    S.pretestStartedAt = Date.now();
    startTimer();
    reportStage("pretest", 0, getItems("pretest").length);
    render();
  }));
  w.append(btns);
  $screen.append(w);
}

// ── Item Screen (Pretest / Posttest) ──
function renderItemScreen(phase) {
  const items = phase === "pretest" ? getItems("pretest") : getPosttestOrder();
  const idx = phase === "pretest" ? S.pretestIndex : S.posttestIndex;
  const item = items[idx];

  if (!item) {
    if (phase === "pretest") {
      S.profileRecommendation = computeProfile();
      S.selectedProfiles = [...S.profileRecommendation.profiles];
      S.stage = "profile_waiting";
      stopTimer();
      // Report to server
      WS.send({
        type: "profile_ready",
        participantId: S.participantId,
        recommendation: S.profileRecommendation
      });
    } else {
      S.stage = "interview";
      stopTimer();
      reportStage("interview", 0, 0);
    }
    render();
    return;
  }

  S.currentItemStartedAt = S.currentItemStartedAt || Date.now();
  if (!timerInterval) startTimer();

  $screen.innerHTML = "";
  const container = el("div", "screen-stack");

  const hdr = el("div", "metric-grid");
  const phaseLabel = phase === "pretest" ? T.phase_pretest : T.phase_posttest;
  const phaseTag = phase === "pretest" ? "pretest" : "posttest";
  hdr.innerHTML = `
    <div class="metric"><div class="label">${esc(T.item_phase)}</div><div class="value"><span class="phase-tag ${phaseTag}">${phaseLabel}</span></div></div>
    <div class="metric"><div class="label">${esc(T.item_id)}</div><div class="value">${esc(formatDisplayItemId(item.id))}</div></div>
    <div class="metric"><div class="label">${esc(T.item_category)}</div><div class="value">${catLabel[item.category] || item.category}</div></div>
    <div class="metric"><div class="label">${esc(T.item_progress)}</div><div class="value">${idx + 1} / ${items.length}</div></div>
  `;
  container.append(hdr);

  const reminderText = phase === "pretest"
    ? T.reminder_pretest
    : T.reminder_posttest;
  container.append(createCallout(reminderText, "warn-callout"));

  const layout = el("div", "split-grid");
  const left = el("div", "screen-stack");
  left.append(contextCard("goal", T.card_goal, `<div class="answer-box">${esc(localizedValue(item, "writing_goal"))}</div>`));
  left.append(contextCard("ai", T.card_ai, renderAiOutput(item)));
  left.append(contextCard("fact", T.card_evidence, renderEvidence(localizedValue(item, "evidence_card", item.evidence_card || { title: "", bullets: [] }))));
  left.append(contextCard("task", T.card_prompt, `<div class="answer-box">${esc(localizedValue(item, "participant_prompt"))}</div>`));

  const right = el("div", "screen-stack");
  right.append(createResponseForm(item, phase));

  layout.append(left, right);
  container.append(layout);
  $screen.append(container);
}

function renderAiOutput(item) {
  const aiAnswer = localizedValue(item, "ai_answer");
  if (aiAnswer) return `<div class="answer-box">${esc(aiAnswer)}</div>`;
  const aiAnswers = localizedValue(item, "ai_answers", item.ai_answers || {});
  return `
    <div class="field-stack" style="gap:10px">
      <div class="answer-box"><strong>${esc(T.answer_a)}</strong><br>${esc(aiAnswers.A || "")}</div>
      <div class="answer-box"><strong>${esc(T.answer_b)}</strong><br>${esc(aiAnswers.B || "")}</div>
    </div>
  `;
}

function renderEvidence(ec) {
  const bullets = (ec?.bullets || []).map(b => `<li>${esc(b)}</li>`).join("");
  return `<div class="answer-box"><ul class="list-tight">${bullets}</ul></div>`;
}

function createResponseForm(item, phase) {
  const form = el("form", "card field-stack");
  form.innerHTML = `<h2 class="card-title">${esc(T.form_title)}</h2>`;

  const opts = item.response_mode === "comparative_judgment"
    ? S.materials.response_schema.comparative_judgment
    : S.materials.response_schema.single_judgment;

  const judgmentField = createRadioGroup(T.label_judgment, "judgment", opts);
  judgmentField.setAttribute("data-section", "judgment");
  judgmentField.querySelector(".prompt-label").insertAdjacentHTML("afterbegin", '<span class="section-step">1</span>');
  form.append(judgmentField);

  const reasonField = createTextArea(T.label_reason, "reason", T.reason_placeholder);
  reasonField.setAttribute("data-section", "reason");
  reasonField.querySelector("label").classList.add("prompt-label");
  reasonField.querySelector("label").insertAdjacentHTML("afterbegin", '<span class="section-step">2</span>');
  form.append(reasonField);

  const actionField = createActionButtonGroup(T.label_next_action, "next_action", S.materials.response_schema.next_action);
  actionField.setAttribute("data-section", "action");
  actionField.querySelector(".prompt-label").insertAdjacentHTML("afterbegin", '<span class="section-step">3</span>');
  form.append(actionField);

  const confidenceField = createSlider(T.label_confidence, "confidence", T.confidence_opts);
  confidenceField.setAttribute("data-section", "confidence");
  confidenceField.querySelector(".prompt-label").insertAdjacentHTML("afterbegin", '<span class="section-step">4</span>');
  form.append(confidenceField);


  const errNode = el("div", "error-text");
  errNode.hidden = true;
  form.append(errNode);

  const actions = el("div", "button-row");
  actions.append(btn(T.btn_save_next, "primary", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const judgment = fd.get("judgment");
    const reason = (fd.get("reason") || "").trim();
    const nextAction = fd.get("next_action");
    const confidence = fd.get("confidence");

    if (!judgment || !reason || !nextAction || !confidence) {
      errNode.hidden = false;
      errNode.textContent = T.err_incomplete;
      return;
    }

    const now = Date.now();
    const resp = {
      participant_id: S.participantId,
      item_id: item.id,
      phase,
      category: item.category,
      response_mode: item.response_mode,
      targeted_flag: phase === "posttest" ? isTargeted(item.category) : null,
      judgment: String(judgment),
      reason,
      next_action: String(nextAction),
      confidence: parseInt(String(confidence)),
      response_time_sec: Math.round((now - S.currentItemStartedAt) / 1000),
      posttest_item_order: phase === "posttest" ? S.posttestIndex : null
    };

    if (phase === "pretest") {
      S.pretestResponses.push(resp);
      S.pretestIndex++;
      reportResponse("pretest", resp);
      reportStage("pretest", S.pretestIndex, getItems("pretest").length);
    } else {
      S.posttestResponses.push(resp);
      S.posttestIndex++;
      reportResponse("posttest", resp);
      reportStage("posttest", S.posttestIndex, getPosttestOrder().length);
    }
    S.currentItemStartedAt = Date.now();

    // Also save to localStorage as backup
    try { localStorage.setItem(`pilot_${S.participantId}`, JSON.stringify(buildExport())); } catch {}

    render();
  }));
  form.append(actions);
  return form;
}

// ── Profile Waiting Screen (NETWORKED: waits for operator approval) ──
function renderProfileWaiting() {
  stopTimer();
  const rec = S.profileRecommendation;
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");
  const metricsHtml = (rec.categorySummaries || []).map((s) => {
    const pct = s.maxScore > 0 ? Number((s.score / s.maxScore * 100).toFixed(0)) : 0;
    const level = pct >= 100 ? "high" : pct >= 50 ? "mid" : "low";
    return `
        <div class="metric">
          <div class="label">${esc(catLabel[s.category] || s.category)}</div>
          <div class="value">${s.score} / ${s.maxScore}</div>
          <div class="category-bar"><div class="category-bar-fill ${level}" style="width:${pct}%"></div></div>
        </div>
    `;
  }).join("");

  // Show scores to participant (read-only)
  w.append(card(T.profile_wait_title, `
    <div class="callout">${T.profile_wait_callout}</div>
    <div class="metric-grid" style="margin-top:14px">${metricsHtml}</div>
  `));

  // Waiting animation
  const waitCard = el("div", "card");
  waitCard.innerHTML = `
    <div class="waiting-overlay">
      <div class="spinner"></div>
      <p><strong>${esc(T.profile_wait_strong)}</strong></p>
      <p style="font-size:.9rem;color:#94a3b8;margin-top:8px">${esc(T.profile_wait_body)}</p>
    </div>
  `;
  w.append(waitCard);

  $screen.append(w);
}

// ── Profile Screen (fallback if operator approves before render) ──
function renderProfile() {
  // In networked mode, this is shown briefly before transitioning to profile_waiting
  renderProfileWaiting();
}

// ── Scene Screen ──
function renderScene() {
  const scenes = getSelectedScenes();
  const scene = scenes[S.sceneIndex];
  if (!scene) {
    S.stage = "transition";
    stopTimer();
    reportStage("transition", 0, 0);
    render();
    return;
  }

  S.currentItemStartedAt = S.currentItemStartedAt || Date.now();
  const filled = fillSlots(scene);
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card(T.scene_title, `
    <div class="pill-row">
      <span class="pill active">${esc(formatSceneLabel(S.sceneIndex))}</span>
      <span class="pill">${esc(localizedValue(scene, "role", scene.role || ""))}</span>
      <span class="phase-tag intervention">${esc(T.badge_scene)} ${S.sceneIndex + 1}/${scenes.length}</span>
    </div>
    <p class="subtitle compact" style="margin-top:10px">${esc(filled.learningObjective || "")}</p>
  `));

  if (filled.sourceItem) {
    w.append(card(T.scene_recap_title, `<p class="helper-text compact">${esc(buildSceneRecapIntro(filled.failedItemLabel))}</p>`));
    w.append(contextCard("goal", T.card_goal, `<div class="answer-box">${esc(localizedValue(filled.sourceItem, "writing_goal"))}</div>`));
    w.append(contextCard("ai", T.card_ai, renderAiOutput(filled.sourceItem)));
    w.append(contextCard("fact", T.card_evidence, renderEvidence(localizedValue(filled.sourceItem, "evidence_card", filled.sourceItem.evidence_card || { title: "", bullets: [] }))));
    w.append(contextCard("task", T.scene_issue_title, `<div class="answer-box">${esc(filled.evidenceGap)}</div>`));
  }

  const sceneCard = el("div", "card field-stack");
  sceneCard.innerHTML = `<h2 class="card-title">${esc(T.scene_script_title)}</h2>`;

  const box = el("div", "scene-box");
  box.innerHTML = filled.lines.map(l => `<p>${esc(l)}</p>`).join("");
  sceneCard.append(box);

  const taskLabel = el("p", "prompt-label compact");
  taskLabel.style.marginTop = "12px";
  taskLabel.textContent = T.scene_task_label + filled.task;
  sceneCard.append(taskLabel);
  sceneCard.append(createCallout(`<p>${esc(filled.taskHelp)}</p>`));

  const ta = document.createElement("textarea");
  ta.id = "scene-response";
  ta.placeholder = T.scene_response_placeholder;
  sceneCard.append(ta);

  // NOTE: operator observation note is now on the Dashboard side

  const actions = el("div", "button-row");
  actions.append(btn(T.btn_save_next, "primary", () => {
    const learnerResp = document.getElementById("scene-response").value.trim();
    const sceneResp = {
      participant_id: S.participantId,
      scene_id: scene.scene_id,
      targeted_profile: filled.targetedProfile,
      source_failed_item: filled.failedItemId,
      learner_response_text: learnerResp,
      response_time_sec: Math.round((Date.now() - S.currentItemStartedAt) / 1000),
      completion_flag: learnerResp.length > 0
    };
    S.sceneResponses.push(sceneResp);
    reportResponse("scene", sceneResp);
    S.sceneIndex++;
    S.currentItemStartedAt = Date.now();
    reportStage("scenes", S.sceneIndex, scenes.length);
    render();
  }));
  sceneCard.append(actions);
  w.append(sceneCard);
  $screen.append(w);
}

// ── Transition Screen ──
function renderTransition() {
  stopTimer();
  S.posttestItemOrder = shuffleArray(getItems("posttest"));
  S.posttestIndex = 0;
  S.posttestResponses = [];

  // Report posttest order to server
  WS.send({ type: "posttest_order", participantId: S.participantId, order: S.posttestItemOrder.map(i => i.id) });

  $screen.innerHTML = "";
  const w = el("div", "screen-stack");
  w.append(card(T.transition_title, `
    <div class="transition-callout">
      <p style="font-size:1.3rem;font-weight:700;margin:0 0 12px">${esc(T.transition_main)}</p>
      <p style="margin:0">${esc(T.transition_sub)}</p>
    </div>
  `));

  const btns = el("div", "button-row");
  btns.append(btn(T.transition_btn, "primary", () => {
    S.posttestStartedAt = Date.now();
    S.stage = "posttest";
    startTimer();
    reportStage("posttest", 0, S.posttestItemOrder.length);
    render();
  }));
  w.append(btns);
  $screen.append(w);
}

// ── Interview Waiting Screen (NETWORKED: operator conducts interview on Dashboard) ──
function renderInterviewWaiting() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card(T.interview_title, `
    <span class="phase-tag interview">${esc(T.interview_tag)}</span>
    <p style="margin-top:10px">${esc(T.interview_intro)}</p>
  `));

  // Show questions for participant reference
  const questions = T.interview_questions;

  const qCard = el("div", "card field-stack");
  qCard.innerHTML = `<h2 class="card-title">${esc(T.interview_ref_title)}</h2><p class="helper-text compact">${esc(T.interview_ref_help)}</p>`;
  questions.forEach((q, i) => {
    const qBlock = el("div", "interview-question");
    qBlock.innerHTML = `<div class="q-number">${esc(T.interview_q_prefix)} ${i + 1}</div><p style="margin:6px 0 4px;font-weight:600">${esc(q)}</p>`;
    qCard.append(qBlock);
  });
  w.append(qCard);

  // Waiting indicator
  const waitCard = el("div", "card");
  waitCard.innerHTML = `
    <div class="waiting-overlay" style="padding:30px 20px">
      <div class="spinner"></div>
      <p>${esc(T.interview_wait)}</p>
    </div>
  `;
  w.append(waitCard);

  $screen.append(w);
}

// ── Debrief Screen (simplified for participant) ──
function renderDebrief() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card(T.debrief_title, `
    <p>${T.debrief_msg}</p>
  `));

  const totalTime = S.sessionStartedAt ? Math.round((Date.now() - S.sessionStartedAt) / 60000) : 0;
  w.append(card(T.summary_title, `
    <div class="metric-grid">
      <div class="metric"><div class="label">${esc(T.summary_participant)}</div><div class="value">${esc(S.participantId)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_time)}</div><div class="value">${totalTime} ${esc(T.summary_min)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_pretest)}</div><div class="value">${S.pretestResponses.length} ${esc(T.summary_items)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_scenes)}</div><div class="value">${S.sceneResponses.length} ${esc(T.summary_scenes_unit)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_posttest)}</div><div class="value">${S.posttestResponses.length} ${esc(T.summary_items)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_profiles)}</div><div class="value">${S.selectedProfiles.map(p => profileLabel[p] || p).join(LABEL_JOINER)}</div></div>
    </div>
  `));

  w.append(card("", `<div class="callout" style="text-align:center">${esc(T.session_complete_message)}</div>`));

  $screen.append(w);
}

// ── Profile Computation ──
function computeProfile() {
  const catScores = {};
  const pretestItems = new Map(getItems("pretest").map(i => [i.id, i]));
  for (const resp of S.pretestResponses) {
    const item = pretestItems.get(resp.item_id);
    if (!item) continue;
    const cat = resp.category;
    if (!catScores[cat]) {
      catScores[cat] = {
        category: cat,
        score: 0,
        maxScore: 0,
        decisionScore: 0,
        actionScore: 0,
        decisionErrors: 0,
        confidenceTotal: 0,
        responseCount: 0,
        tiePriority: CATEGORY_TIEBREAK_PRIORITY[cat] ?? 99
      };
    }
    catScores[cat].maxScore += 2;
    catScores[cat].responseCount += 1;
    catScores[cat].confidenceTotal += Number(resp.confidence) || 0;

    if (item.gold_label.judgment.includes(resp.judgment)) {
      catScores[cat].decisionScore += 1;
      catScores[cat].score += 1;
    } else {
      catScores[cat].decisionErrors++;
    }
    if (item.gold_label.next_action.includes(resp.next_action)) {
      catScores[cat].actionScore += 1;
      catScores[cat].score += 1;
    }
  }
  const summaries = Object.values(catScores).map(s => ({
    ...s,
    avgConfidence: s.responseCount > 0 ? Number((s.confidenceTotal / s.responseCount).toFixed(2)) : null
  })).sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    if (a.tiePriority !== b.tiePriority) return a.tiePriority - b.tiePriority;
    if ((a.avgConfidence ?? 99) !== (b.avgConfidence ?? 99)) return (a.avgConfidence ?? 99) - (b.avgConfidence ?? 99);
    if (a.decisionErrors !== b.decisionErrors) return b.decisionErrors - a.decisionErrors;
    return (a.category || "").localeCompare(b.category || "");
  });
  const profiles = summaries.slice(0, 2).map(s => categoryToProfile[s.category]).filter(Boolean);
  return { method: "auto-score: judgment + action + lean30 tie-break", categorySummaries: summaries, profiles };
}

// ── Scene helpers ──
function getSelectedScenes() {
  return S.selectedProfiles.flatMap(p => S.materials.scene_sequences[p] || []);
}

function fillSlots(scene) {
  const targetedProfile = profileFromSceneId(scene.scene_id);
  const sourceResp = findFailedResponse(targetedProfile);
  const sourceItem = S.materials.items.find(i => i.id === sourceResp?.item_id);
  const gap = localizedValue(sourceItem?.gold_label, "reason_anchor", T.default_evidence_gap);
  const lines = localizedValue(scene, "script_lines", scene.script_lines || []).map(l =>
    l.replace(/\{failed_item_id\}/g, formatDisplayItemId(sourceResp?.item_id))
     .replace(/\{evidence_gap\}/g, gap)
  );
  return {
    targetedProfile,
    failedItemId: sourceResp?.item_id || "PRE_UNKNOWN",
    failedItemLabel: formatDisplayItemId(sourceResp?.item_id),
    learningObjective: localizedValue(scene, "learning_objective"),
    sourceItem,
    evidenceGap: gap,
    lines,
    task: localizedValue(scene, "learner_task"),
    taskHelp: buildSceneTaskHelp(localizedValue(scene, "learner_task"), formatDisplayItemId(sourceResp?.item_id))
  };
}

function buildSceneRecapIntro(itemLabel) {
  if (LANG === "en") {
    return `This scene is based on your earlier ${itemLabel}. Review the original task, AI output, and facts package before answering.`;
  }
  return `本场景基于你之前的${itemLabel}。请先查看原始题干、AI 输出和事实情况，再完成下面的学习任务。`;
}

function buildSceneTaskHelp(task, itemLabel) {
  const mentionsOriginal = /原句|这句话|这个声明|原始句子|original sentence|this phrase|this claim/i.test(task || "");
  if (LANG === "en") {
    if (mentionsOriginal) {
      return `This task refers to ${itemLabel}. “The original sentence” or “this claim” means the AI output shown in the recap above.`;
    }
    return `Use the recap above for ${itemLabel}. Base your answer on the displayed AI output and facts package rather than memory alone.`;
  }
  if (mentionsOriginal) {
    return `说明：本任务对应${itemLabel}。如果题目中提到“原句”“这句话”或“这个声明”，都指上方回顾中展示的 AI 输出。`;
  }
  return `说明：本任务对应${itemLabel}。请根据上方回顾中的 AI 输出和事实情况作答，不要只凭记忆作答。`;
}

function profileFromSceneId(id) {
  if (id.startsWith("H")) return "hallucination-weak";
  if (id.startsWith("V")) return "verification-weak";
  if (id.startsWith("T")) return "trust-calibration-weak";
  if (id.startsWith("D")) return "scope-generalization-weak";
  return "";
}

function findFailedResponse(profile) {
  const cat = profileToCategory[profile];
  const items = getItems("pretest").filter(i => i.category === cat);
  const resps = S.pretestResponses.filter(r => r.category === cat);
  for (const item of items) {
    const r = resps.find(x => x.item_id === item.id);
    if (r && !item.gold_label.judgment.includes(r.judgment)) return r;
  }
  return resps[0] || null;
}

// ── Posttest randomization ──
function getPosttestOrder() {
  if (S.posttestItemOrder && S.posttestItemOrder.length > 0) return S.posttestItemOrder;
  S.posttestItemOrder = shuffleArray(getItems("posttest"));
  return S.posttestItemOrder;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Utility ──
function getItems(phase) { return (S.materials?.items || []).filter(i => i.phase === phase); }
function isTargeted(category) { return S.selectedProfiles.includes(categoryToProfile[category]); }

function buildExport() {
  return {
    study_id: S.materials?.study_id,
    version: S.materials?.version,
    participant_id: S.participantId,
    session_started_at: S.sessionStartedAt ? new Date(S.sessionStartedAt).toISOString() : null,
    selected_profiles: S.selectedProfiles,
    profile_override: S.profileOverride,
    profile_recommendation: S.profileRecommendation,
    pretest_responses: S.pretestResponses,
    scene_responses: S.sceneResponses,
    posttest_responses: S.posttestResponses,
    posttest_item_order: S.posttestItemOrder.map(i => typeof i === "string" ? i : i.id),
    interview_responses: S.interviewResponses,
    exported_at: new Date().toISOString()
  };
}

// ── DOM Helpers ──
function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function card(title, html, cls = "") {
  const c = el("div", cls ? `card ${cls}` : "card");
  c.innerHTML = `${title ? `<h2 class="card-title">${title}</h2>` : ""}${html}`;
  return c;
}
function contextCard(kind, title, html) { return card(title, html, `context-card context-${kind}`); }
function createCallout(text, cls) { const c = el("div", "callout " + (cls || "")); c.innerHTML = text; return c; }

function createRadioGroup(labelText, name, values, compact = false) {
  const w = el("div", compact ? "field-stack compact" : "field-stack");
  const label = el("div", "prompt-label"); label.textContent = labelText; w.append(label);
  const grid = el("div", compact ? "option-grid compact" : "option-grid");
  values.forEach(v => {
    const frag = radioTpl.content.cloneNode(true);
    const input = frag.querySelector("input");
    input.name = name;
    input.value = v;
    frag.querySelector("span").textContent = v;
    grid.append(frag);
  });
  w.append(grid);
  return w;
}

function createTextArea(labelText, name, placeholder) {
  const w = el("div", "field-stack");
  w.innerHTML = `<label for="${name}">${labelText}</label><textarea id="${name}" name="${name}" placeholder="${escAttr(placeholder)}"></textarea>`;
  return w;
}

function createActionButtonGroup(labelText, name, values) {
  const w = el("div", "field-stack action-field");
  const label = el("div", "prompt-label"); label.textContent = labelText; w.append(label);
  const group = el("div", "action-btn-group");

  // Hidden input to store the value
  const input = el("input");
  input.type = "hidden";
  input.name = name;
  input.id = name;
  w.append(input);

  values.forEach(v => {
    const b = el("button", "action-btn");
    b.type = "button";
    b.textContent = v;
    b.onclick = () => {
      group.querySelectorAll(".action-btn").forEach(btn => btn.classList.remove("selected"));
      b.classList.add("selected");
      input.value = v;
    };
    group.append(b);
  });
  w.append(group);
  return w;
}

function createSlider(labelText, name, values) {
  const w = el("div", "field-stack slider-field");
  const label = el("div", "prompt-label"); label.textContent = labelText; w.append(label);

  // Current value badge
  const badge = el("div", "slider-badge");
  badge.setAttribute("data-value", "3");

  // Slider track container
  const sliderBox = el("div", "slider-box");
  const input = el("input", "slider-input");
  input.type = "range";
  input.name = name;
  input.id = name;
  input.min = "1";
  input.max = values.length.toString();
  input.step = "1";
  input.value = "3";

  // Labeled ticks row
  const tickRow = el("div", "slider-ticks");
  const tickEls = [];
  for (let i = 0; i < values.length; i++) {
    const tick = el("div", "slider-tick");
    const num = el("span", "slider-tick-num"); num.textContent = i + 1;
    const txt = el("span", "slider-tick-label"); txt.textContent = values[i].replace(/^\d+\s*[-–—]\s*/, "");
    tick.append(num, txt);
    tick.onclick = () => { input.value = (i + 1).toString(); update(); };
    tickRow.append(tick);
    tickEls.push(tick);
  }

  const update = () => {
    const val = parseInt(input.value);
    badge.textContent = values[val - 1] || val;
    badge.setAttribute("data-value", val);
    tickEls.forEach((t, idx) => {
      t.classList.toggle("active", idx === val - 1);
    });
    // Update track fill percentage
    const pct = ((val - 1) / (values.length - 1)) * 100;
    sliderBox.style.setProperty("--fill", pct + "%");
  };
  input.oninput = update;

  sliderBox.append(input);
  w.append(badge, sliderBox, tickRow);
  update();
  return w;
}

function createSelect(labelText, name, values) {
  const w = el("div", "field-stack");
  const label = el("label"); label.htmlFor = name; label.textContent = labelText;
  const select = document.createElement("select"); select.name = name; select.id = name;
  const ph = document.createElement("option"); ph.value = ""; ph.textContent = T.select_placeholder; ph.selected = true; ph.disabled = true;
  select.append(ph);
  values.forEach(v => { const opt = document.createElement("option"); opt.value = v; opt.textContent = v; select.append(opt); });
  w.append(label, select);
  return w;
}

function btn(text, cls, onClick) {
  const b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = text;
  b.addEventListener("click", onClick); return b;
}

function renderError() {
  $screen.innerHTML = `
    <div class="screen-stack">
      <div class="callout warn-callout">
        <strong>${esc(T.error_title)}</strong>
        <p class="compact">${esc(S.errors || T.error_unknown)}</p>
        <p class="compact">${esc(T.error_retry_help)}</p>
      </div>
    </div>
  `;
}

function esc(t) { return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escAttr(t) { return esc(t).replace(/"/g,"&quot;"); }
