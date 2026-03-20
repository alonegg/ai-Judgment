/* ============================================================
   Operator Dashboard — AI Judgment Micro-Intervention Pilot
   ============================================================ */

const { LANG, T } = window.DashboardI18n;
const LABEL_JOINER = LANG === "en" ? ", " : "、";

// ── State ──
const participants = new Map();  // pid -> session snapshot
let selectedPid = null;
let ws = null;

// ── DOM ──
const $grid = document.getElementById("participant-grid");
const $empty = document.getElementById("empty-state");
const $panel = document.getElementById("action-panel");
const $panelTitle = document.getElementById("panel-title");
const $panelBody = document.getElementById("panel-body");
const $connStatus = document.getElementById("conn-status");
const $sessionCount = document.getElementById("session-count");
const $eventLog = document.getElementById("event-log");

// ── Profile / Category maps ──
const catLabel = T.cat_label;
const profileLabel = T.profile_label;
const stageLabel = T.stage_label;

// ── WebSocket ──
function connect() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(`${proto}//${location.host}`);

  ws.onopen = () => {
    $connStatus.className = "conn-badge online";
    $connStatus.textContent = T.conn_connected;
    ws.send(JSON.stringify({ type: "join", role: "operator" }));
  };

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    handleMessage(msg);
  };

  ws.onclose = () => {
    $connStatus.className = "conn-badge offline";
    $connStatus.textContent = T.conn_disconnected;
    setTimeout(connect, 3000);
  };

  ws.onerror = () => {};
}

function wsSend(msg) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

// ── Message handler ──
function handleMessage(msg) {
  switch (msg.type) {
    case "joined":
      // Initial load of all sessions
      if (msg.activeSessions) {
        msg.activeSessions.forEach(s => participants.set(s.participantId, s));
      }
      renderGrid();
      break;

    case "participant_joined": {
      const s = msg.participant;
      participants.set(s.participantId, s);
      logEvent(s.participantId, T.log_connected);
      renderGrid();
      break;
    }

    case "participant_disconnected": {
      const s = participants.get(msg.participantId);
      if (s) { s.online = false; }
      logEvent(msg.participantId, T.log_disconnected);
      renderGrid();
      if (selectedPid === msg.participantId) renderPanel();
      break;
    }

    case "participant_stale": {
      const s = participants.get(msg.participantId);
      if (s) s.online = false;
      logEvent(msg.participantId, T.log_stale);
      renderGrid();
      break;
    }

    case "stage_update": {
      const s = participants.get(msg.participantId);
      if (s) {
        s.currentStage = msg.stage;
        s.stageIndex = msg.stageIndex;
        s.stageTotal = msg.stageTotal;
        s.online = true;
      }
      logEvent(msg.participantId, `${T.log_enter} ${stageLabel[msg.stage] || msg.stage} ${msg.stageIndex || ""}/${msg.stageTotal || ""}`.trim());
      renderGrid();
      if (selectedPid === msg.participantId) renderPanel();
      break;
    }

    case "response_received": {
      const s = participants.get(msg.participantId);
      if (s) {
        s.stageIndex = msg.stageIndex;
        s.online = true;
        // Store responses locally for panel display
        if (!s._responses) s._responses = [];
        s._responses.push(msg.response);
      }
      const r = msg.response;
      const detail = r.item_id
        ? `${T.log_submit_item} ${r.item_id} (${r.response_time_sec}s, ${T.log_confidence}=${r.confidence || "-"})`
        : `${T.log_submit_scene} ${r.scene_id} (${r.response_time_sec}s)`;
      logEvent(msg.participantId, detail);
      renderGrid();
      if (selectedPid === msg.participantId) renderPanel();
      break;
    }

    case "profile_needs_approval": {
      const s = participants.get(msg.participantId);
      if (s) {
        s.currentStage = "profile_waiting";
        s.profileRecommendation = msg.recommendation;
        s.online = true;
      }
      logEvent(msg.participantId, T.log_profile_waiting);
      renderGrid();
      // Auto-select this participant
      selectedPid = msg.participantId;
      renderPanel();
      $panel.hidden = false;
      break;
    }

    case "export_ready": {
      downloadJson(msg.data, `${msg.participantId}_final.json`);
      logEvent(msg.participantId, T.log_export_done);
      break;
    }

    case "export_all_ready": {
      downloadJson(msg.data, `batch_export_${Date.now()}.json`);
      logEvent("SYSTEM", T.log_export_all_done);
      break;
    }

    case "event_log": {
      logEvent(msg.participantId, msg.detail || msg.event);
      break;
    }
  }
}

// ── Render participant grid ──
function renderGrid() {
  // Remove old cards
  $grid.querySelectorAll(".p-card").forEach(c => c.remove());
  $empty.hidden = participants.size > 0;
  $sessionCount.textContent = `${participants.size} ${T.participants_suffix}`;

  for (const [pid, s] of participants) {
    const card = document.createElement("div");
    card.className = `p-card ${getStatusClass(s)} ${pid === selectedPid ? "selected" : ""}`;
    card.onclick = () => { selectedPid = pid; renderGrid(); renderPanel(); $panel.hidden = false; };

    const stage = stageLabel[s.currentStage] || s.currentStage;
    const progressText = s.stageTotal ? `${s.stageIndex || 0}/${s.stageTotal}` : "";

    card.innerHTML = `
      <div class="conn-indicator ${s.online ? "online" : "offline"}"></div>
      <div class="pid">${esc(pid)}</div>
      <span class="stage-badge">${esc(stage)}</span>
      ${progressText ? `<div class="progress-text">${progressText}</div>` : ""}
    `;
    $grid.append(card);
  }
}

function getStatusClass(s) {
  if (!s.online) return "status-offline";
  const st = s.currentStage;
  if (st === "profile_waiting") return "status-waiting";
  if (st === "interview") return "status-interview";
  if (st === "debrief") return "status-done";
  return "status-running";
}

// ── Render action panel for selected participant ──
function renderPanel() {
  if (!selectedPid) { $panel.hidden = true; return; }
  const s = participants.get(selectedPid);
  if (!s) { $panel.hidden = true; return; }

  $panelTitle.textContent = `${selectedPid} — ${stageLabel[s.currentStage] || s.currentStage}`;
  $panelBody.innerHTML = "";

  const stage = s.currentStage;

  // ── Profile approval panel ──
  if (stage === "profile_waiting" && s.profileRecommendation) {
    renderProfileApproval(s);
  }
  // ── Interview panel ──
  else if (stage === "interview") {
    renderInterviewPanel(s);
  }
  // ── Debrief / export panel ──
  else if (stage === "debrief") {
    renderDebriefPanel(s);
  }
  // ── General info panel ──
  else {
    renderGeneralPanel(s);
  }
}

function renderProfileApproval(s) {
  const rec = s.profileRecommendation;
  const section = document.createElement("div");
  section.className = "panel-section";
  section.innerHTML = `<h3>${esc(T.section_scores)}</h3>`;

  const scoreGrid = document.createElement("div");
  scoreGrid.className = "score-grid";
  (rec.categorySummaries || []).forEach(cs => {
    const pct = cs.maxScore > 0 ? (cs.score / cs.maxScore * 100).toFixed(0) : 0;
    const level = cs.score <= 1 ? "low" : cs.score <= 2 ? "mid" : "high";
    const item = document.createElement("div");
    item.className = "score-item";
    item.innerHTML = `
      <div class="label">${esc(catLabel[cs.category] || cs.category)}</div>
      <div class="value">${cs.score} / ${cs.maxScore} (errors: ${cs.decisionErrors})</div>
      <div class="score-bar"><div class="score-bar-fill ${level}" style="width:${pct}%"></div></div>
    `;
    scoreGrid.append(item);
  });
  section.append(scoreGrid);

  // Recommendation
  const recText = document.createElement("p");
  recText.style.cssText = "margin-top:14px;color:var(--text-muted);";
  recText.innerHTML = `${esc(T.system_recommend)} <strong>${(rec.profiles || []).map(p => profileLabel[p] || p).join(LABEL_JOINER)}</strong>`;
  section.append(recText);

  // Profile checkboxes
  const profileSection = document.createElement("div");
  profileSection.className = "panel-section";
  profileSection.innerHTML = `<h3>${esc(T.section_select_profiles)}</h3>`;

  const allProfiles = ["hallucination-weak","verification-weak","trust-calibration-weak","scope-generalization-weak"];
  allProfiles.forEach(p => {
    const row = document.createElement("div");
    row.className = "chk-row";
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.id = `chk_${p}`; cb.value = p;
    cb.checked = (rec.profiles || []).includes(p);
    const lbl = document.createElement("label");
    lbl.htmlFor = `chk_${p}`; lbl.textContent = profileLabel[p] || p;
    row.append(cb, lbl);
    profileSection.append(row);
  });

  // Override note
  const noteGroup = document.createElement("div");
  noteGroup.className = "form-group";
  noteGroup.innerHTML = `<label>${esc(T.override_note_label)}</label><textarea id="override-note" placeholder="${esc(T.override_note_placeholder)}"></textarea>`;
  profileSection.append(noteGroup);

  // Buttons
  const btns = document.createElement("div");
  btns.className = "btn-row";
  const approveBtn = document.createElement("button");
  approveBtn.className = "btn-sm success";
  approveBtn.textContent = T.btn_approve;
  approveBtn.onclick = () => {
    const checked = allProfiles.filter(p => document.getElementById(`chk_${p}`).checked);
    if (checked.length !== 2) { alert(T.alert_select_two); return; }
    const note = document.getElementById("override-note").value.trim();
    wsSend({
      type: "approve_profile",
      participantId: selectedPid,
      selectedProfiles: checked,
      overrideNote: note
    });
    const ss = participants.get(selectedPid);
    if (ss) { ss.currentStage = "scenes"; ss.selectedProfiles = checked; }
    logEvent(selectedPid, `${T.log_profile_approved}: ${checked.join(LABEL_JOINER)}`);
    renderGrid();
    renderPanel();
  };

  const useRecBtn = document.createElement("button");
  useRecBtn.className = "btn-sm secondary";
  useRecBtn.textContent = T.btn_use_recommend;
  useRecBtn.onclick = () => {
    allProfiles.forEach(p => {
      document.getElementById(`chk_${p}`).checked = (rec.profiles || []).includes(p);
    });
  };
  btns.append(approveBtn, useRecBtn);
  profileSection.append(btns);

  $panelBody.append(section, profileSection);
}

function renderInterviewPanel(s) {
  const section = document.createElement("div");
  section.className = "panel-section";
  section.innerHTML = `<h3>${esc(T.section_interview)}</h3><p style="color:var(--text-muted);font-size:.85rem;margin-bottom:12px;">${esc(T.interview_help)}</p>`;

  const questions = T.interview_questions;

  questions.forEach((q, i) => {
    const qDiv = document.createElement("div");
    qDiv.className = "interview-q";
    qDiv.innerHTML = `<div class="q-label">${esc(T.interview_q_prefix)} ${i + 1}: ${esc(q)}</div>`;
    const ta = document.createElement("textarea");
    ta.className = "form-group";
    ta.style.cssText = "width:100%;min-height:60px;background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:8px 12px;font-size:.9rem;resize:vertical;margin-top:4px;";
    ta.id = `interview_q${i}`;
    ta.placeholder = T.interview_placeholder;
    ta.value = (s.interviewResponses && s.interviewResponses[`q${i}`]) || "";
    qDiv.append(ta);
    section.append(qDiv);
  });

  const btns = document.createElement("div");
  btns.className = "btn-row";
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn-sm success";
  saveBtn.textContent = T.btn_save_interview;
  saveBtn.onclick = () => {
    const responses = {};
    questions.forEach((_, i) => {
      responses[`q${i}`] = document.getElementById(`interview_q${i}`).value.trim();
    });
    wsSend({ type: "save_interview", participantId: selectedPid, responses });
    const ss = participants.get(selectedPid);
    if (ss) { ss.currentStage = "debrief"; ss.interviewResponses = responses; }
    logEvent(selectedPid, T.log_interview_done);
    renderGrid();
    renderPanel();
  };
  btns.append(saveBtn);
  section.append(btns);
  $panelBody.append(section);
}

function renderDebriefPanel(s) {
  // Pattern coding
  const codingSection = document.createElement("div");
  codingSection.className = "panel-section";
  codingSection.innerHTML = `<h3>${esc(T.section_coding)}</h3>`;

  const patterns = ["rule-seeking","evidence-checking","answer-comparing","uncertainty-monitoring","scope-checking","authority-following","surface-editing"];

  const primaryGroup = createFormSelect("primary_pattern", T.coding_primary, patterns);
  const secondaryGroup = createFormSelect("secondary_pattern", T.coding_secondary, patterns);
  codingSection.append(primaryGroup, secondaryGroup);

  const noteGroup = document.createElement("div");
  noteGroup.className = "form-group";
  noteGroup.innerHTML = `<label>${esc(T.coding_note_label)}</label><textarea id="pattern_note" placeholder="${esc(T.coding_note_placeholder)}"></textarea>`;
  codingSection.append(noteGroup);

  const codingBtns = document.createElement("div");
  codingBtns.className = "btn-row";
  const savePatternBtn = document.createElement("button");
  savePatternBtn.className = "btn-sm";
  savePatternBtn.textContent = T.btn_save_pattern;
  savePatternBtn.onclick = () => {
    const pattern = {
      primary: document.getElementById("primary_pattern").value,
      secondary: document.getElementById("secondary_pattern").value,
      note: document.getElementById("pattern_note").value.trim()
    };
    wsSend({ type: "save_pattern", participantId: selectedPid, pattern });
    logEvent(selectedPid, `${T.log_pattern_saved}: ${pattern.primary}`);
  };
  codingBtns.append(savePatternBtn);
  codingSection.append(codingBtns);

  // Export
  const exportSection = document.createElement("div");
  exportSection.className = "panel-section";
  exportSection.innerHTML = `<h3>${esc(T.section_export)}</h3>`;
  const exportBtns = document.createElement("div");
  exportBtns.className = "btn-row";

  const exportBtn = document.createElement("button");
  exportBtn.className = "btn-sm";
  exportBtn.textContent = T.btn_export_one;
  exportBtn.onclick = () => { wsSend({ type: "export_session", participantId: selectedPid }); };

  exportBtns.append(exportBtn);
  exportSection.append(exportBtns);

  $panelBody.append(codingSection, exportSection);

  // Show response history
  renderResponseHistory(s);
}

function renderGeneralPanel(s) {
  // Quick actions
  const actSection = document.createElement("div");
  actSection.className = "panel-section";
  actSection.innerHTML = `<h3>${esc(T.section_quick_actions)}</h3>`;

  const nudgeRow = document.createElement("div");
  nudgeRow.className = "btn-row";

  const nudges = T.nudges;
  nudges.forEach(([label, msg]) => {
    const b = document.createElement("button");
    b.className = "btn-sm secondary";
    b.textContent = label;
    b.onclick = () => {
      wsSend({ type: "send_nudge", participantId: selectedPid, message: msg });
      logEvent(selectedPid, `${T.log_nudge_sent}: ${msg}`);
    };
    nudgeRow.append(b);
  });

  // Custom nudge
  const customGroup = document.createElement("div");
  customGroup.className = "form-group";
  customGroup.style.display = "flex";
  customGroup.style.gap = "8px";
  customGroup.style.marginTop = "8px";
  const customInput = document.createElement("input");
  customInput.id = "custom-nudge";
  customInput.placeholder = T.custom_nudge_placeholder;
  customInput.style.flex = "1";
  const customBtn = document.createElement("button");
  customBtn.className = "btn-sm";
  customBtn.textContent = T.btn_send;
  customBtn.onclick = () => {
    const msg = document.getElementById("custom-nudge").value.trim();
    if (!msg) return;
    wsSend({ type: "send_nudge", participantId: selectedPid, message: msg });
    logEvent(selectedPid, `${T.log_nudge_sent}: ${msg}`);
    document.getElementById("custom-nudge").value = "";
  };
  customGroup.append(customInput, customBtn);

  actSection.append(nudgeRow, customGroup);
  $panelBody.append(actSection);

  // Observation note (for scenes)
  if (s.currentStage === "scenes") {
    const obsSection = document.createElement("div");
    obsSection.className = "panel-section";
    obsSection.innerHTML = `<h3>${esc(T.section_observation)}</h3>`;
    const obsGroup = document.createElement("div");
    obsGroup.className = "form-group";
    obsGroup.innerHTML = `<label>${esc(T.observation_label)}</label><textarea id="obs-note" placeholder="${esc(T.observation_placeholder)}"></textarea>`;
    obsSection.append(obsGroup);

    const obsBtn = document.createElement("button");
    obsBtn.className = "btn-sm";
    obsBtn.textContent = T.btn_save_observation;
    obsBtn.style.marginTop = "8px";
    obsBtn.onclick = () => {
      const note = document.getElementById("obs-note").value.trim();
      if (!note) return;
      wsSend({ type: "add_observation", participantId: selectedPid, sceneId: `scene_${s.stageIndex || 0}`, note });
      logEvent(selectedPid, `${T.log_observation_saved}: ${note.substring(0, 40)}...`);
      document.getElementById("obs-note").value = "";
    };
    obsSection.append(obsBtn);
    $panelBody.append(obsSection);
  }

  // Response history
  renderResponseHistory(s);
}

function renderResponseHistory(s) {
  if (!s._responses || s._responses.length === 0) return;
  const section = document.createElement("div");
  section.className = "panel-section";
  section.innerHTML = `<h3>${esc(T.section_responses)} (${s._responses.length})</h3>`;

  const list = document.createElement("div");
  list.className = "resp-list";

  [...s._responses].reverse().forEach(r => {
    const item = document.createElement("div");
    item.className = "resp-item";
    const id = r.item_id || r.scene_id || "unknown";
    item.innerHTML = `
      <div class="resp-header">
        <span class="item-id">${esc(id)}</span>
        <span class="time">${r.response_time_sec}s</span>
      </div>
      ${r.judgment ? `<div>${esc(T.resp_judgment)}: ${esc(r.judgment)} | ${esc(T.resp_confidence)}: ${r.confidence || "-"}</div>` : ""}
      ${r.reason ? `<div style="color:var(--text-muted);font-size:.8rem;margin-top:4px;">${esc(r.reason.substring(0, 100))}</div>` : ""}
      ${r.learner_response_text ? `<div style="color:var(--text-muted);font-size:.8rem;margin-top:4px;">${esc(r.learner_response_text.substring(0, 100))}</div>` : ""}
    `;
    list.append(item);
  });
  section.append(list);
  $panelBody.append(section);
}

// ── Event log ──
function logEvent(pid, message) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
  entry.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="log-pid">${esc(pid)}</span>
    <span class="log-msg">${esc(message)}</span>
  `;
  $eventLog.prepend(entry);

  // Limit log entries
  while ($eventLog.children.length > 200) $eventLog.lastChild.remove();
}

// ── Helpers ──
function createFormSelect(id, label, options) {
  const group = document.createElement("div");
  group.className = "form-group";
  group.innerHTML = `<label for="${id}">${label}</label>`;
  const select = document.createElement("select");
  select.id = id;
  const ph = document.createElement("option");
  ph.value = ""; ph.textContent = T.select_placeholder; ph.selected = true;
  select.append(ph);
  options.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v; opt.textContent = v;
    select.append(opt);
  });
  group.append(select);
  return group;
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function esc(t) { return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

// ── Panel close ──
document.getElementById("panel-close").onclick = () => {
  selectedPid = null;
  $panel.hidden = true;
  renderGrid();
};

// ── Export all ──
document.getElementById("btn-export-all").onclick = () => {
  wsSend({ type: "export_all" });
};

// ── Boot ──
connect();
logEvent("SYSTEM", T.dashboard_started);
