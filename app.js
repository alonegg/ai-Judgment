/* ============================================================
   AI Judgment Micro-Intervention Pilot — v2
   Full experiment flow:
   consent → warmup → pretest(8) → profile → scenes(4) → transition → posttest(8) → interview → debrief/export
   ============================================================ */

const MATERIALS_PATH = "./materials_v1.json";

// ── State ──
const S = {
  materials: null,
  participantId: "",
  stage: "loading",         // loading|consent|warmup|pretest|profile|scenes|transition|posttest|interview|debrief
  pretestIndex: 0,
  posttestIndex: 0,
  sceneIndex: 0,
  pretestResponses: [],
  posttestResponses: [],
  sceneResponses: [],
  interviewResponses: {},
  interactionPattern: { primary: "", secondary: "", note: "" },
  operatorNotes: [],        // real-time scene observation notes
  profileOverride: false,
  pretestStartedAt: null,
  posttestStartedAt: null,
  currentItemStartedAt: null,
  sessionStartedAt: null,
  selectedProfiles: [],
  profileRecommendation: null,
  posttestItemOrder: [],    // randomized posttest item ids
  errors: ""
};

const STAGES = ["consent","warmup","pretest","profile","scenes","transition","posttest","interview","debrief"];

const categoryToProfile = {
  "hallucinated-citation": "hallucination-weak",
  "source-verification": "verification-weak",
  "trust-calibration": "trust-calibration-weak",
  "scope-generalization": "scope-generalization-weak"
};

const profileToCategory = Object.fromEntries(Object.entries(categoryToProfile).map(([k,v]) => [v,k]));

// ── DOM refs ──
const $screen = document.getElementById("screen");
const $badge = document.getElementById("session-badge");
const $timer = document.getElementById("timer");
const $progress = document.getElementById("progress-bar");
const $progressFill = document.getElementById("progress-fill");
const radioTpl = document.getElementById("radio-group-template");

// ── Timer ──
let timerInterval = null;
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

// ── Progress ──
function updateProgress() {
  const idx = STAGES.indexOf(S.stage);
  if (idx < 0) { $progress.hidden = true; return; }
  $progress.hidden = false;
  const pct = ((idx + 1) / STAGES.length * 100).toFixed(0);
  $progressFill.style.width = pct + "%";
}

// ── Bootstrap ──
bootstrap();
async function bootstrap() {
  try {
    const res = await fetch(MATERIALS_PATH);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    S.materials = await res.json();
    S.stage = "consent";
    render();
  } catch (e) {
    S.errors = String(e);
    renderError();
  }
}

// ── Master render ──
function render() {
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
  const renderers = {
    consent: renderConsent,
    warmup: renderWarmup,
    pretest: renderItemScreen.bind(null, "pretest"),
    profile: renderProfile,
    scenes: renderScene,
    transition: renderTransition,
    posttest: renderItemScreen.bind(null, "posttest"),
    interview: renderInterview,
    debrief: renderDebrief
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
  const map = {
    consent: "Welcome",
    warmup: "Warm-up",
    pretest: `Pretest ${S.pretestIndex + 1}/${getItems("pretest").length}`,
    profile: "Profile",
    scenes: `Scene ${S.sceneIndex + 1}/${getSelectedScenes().length}`,
    transition: "Transition",
    posttest: `Posttest ${S.posttestIndex + 1}/${getPosttestOrder().length}`,
    interview: "Interview",
    debrief: "Export"
  };
  return map[S.stage] || S.stage;
}

// ── Consent Screen ──
function renderConsent() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card("欢迎参加本研究", `
    <p>本研究关注大学生在使用生成式 AI 处理 academic writing 任务时，如何判断 AI 输出是否可信。</p>
    <p>在本研究中，你将看到若干写作目标、AI 生成的回答、以及配套 evidence card。你的任务不是"把句子写得更漂亮"，而是判断 AI 输出能不能直接用、问题出在哪里、下一步应该怎么做。</p>
  `));

  w.append(card("实验流程概览", `
    <div class="pill-row">
      <span class="pill active">同意书</span>
      <span class="pill">热身</span>
      <span class="pill">前测 ×8</span>
      <span class="pill">个性化诊断</span>
      <span class="pill">干预练习 ×4</span>
      <span class="pill">后测 ×8</span>
      <span class="pill">访谈</span>
      <span class="pill">结束</span>
    </div>
    <p class="helper-text" style="margin-top:12px">总时长约 <strong>75-90 分钟</strong></p>
  `));

  w.append(card("知情同意", `
    <div class="consent-grid">
      <div class="consent-item">
        <div class="consent-icon">1</div>
        <div>我们会记录你的题目选择、简短解释、confidence rating 和完成时间。</div>
      </div>
      <div class="consent-item">
        <div class="consent-icon">2</div>
        <div>我们不会评估你的英语水平，也不会把结果用于课程成绩。</div>
      </div>
      <div class="consent-item">
        <div class="consent-icon">3</div>
        <div>所有数据将匿名处理，仅用于学术研究目的。</div>
      </div>
      <div class="consent-item">
        <div class="consent-icon">4</div>
        <div>你可以随时退出实验，无需说明理由。</div>
      </div>
    </div>
  `));

  const setupCard = el("div", "card field-stack");
  setupCard.innerHTML = `
    <h2 class="card-title">Session Setup</h2>
    <label for="pid">Participant ID</label>
    <input id="pid" type="text" placeholder="P01" value="${esc(S.participantId)}" />
    <p class="helper-text compact">由实验员分配的匿名编号，如 <code>P01</code></p>
  `;
  w.append(setupCard);

  const btns = el("div", "button-row");
  btns.append(btn("我已阅读并同意，开始实验", "primary", () => {
    const v = document.getElementById("pid").value.trim();
    if (!v) { alert("请输入 Participant ID"); return; }
    S.participantId = v;
    S.sessionStartedAt = Date.now();
    S.stage = "warmup";
    render();
  }));
  w.append(btns);
  $screen.append(w);
}

// ── Warm-up Screen ──
function renderWarmup() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card("热身练习", `
    <p>在正式测试前，我们先用一道示例帮助你熟悉答题格式。</p>
  `));

  w.append(card("示例：Writing Goal", `
    <div class="answer-box">你要写一句 related work：<br>"Some students use AI tools during early drafting."</div>
  `));

  w.append(card("示例：AI Answer", `
    <div class="answer-box">"Research proves that all students benefit equally from AI drafting tools."</div>
  `));

  w.append(card("示例：Evidence Card", `
    <div class="answer-box">
      <ul class="list-tight">
        <li>A small class-based study reports that some students found AI useful for early brainstorming.</li>
        <li>The paper does not compare all students.</li>
        <li>The paper does not show equal benefit across students.</li>
      </ul>
    </div>
  `));

  w.append(card("示例讲解", `
    <div class="callout">
      <p><strong>合理判断：</strong><code>Revise</code></p>
      <p>因为 AI 的回答中 "all students"、"benefit equally"、"proves" 都超出了 evidence card 给出的信息。</p>
      <p>下一步动作可以选择 <code>weaken the claim wording</code>。</p>
    </div>
    <div style="margin-top:14px">
      <strong>答题四步骤：</strong>
      <ol class="list-tight" style="padding-left:20px;margin-top:8px;">
        <li>做出判断（Accept / Revise / Reject 或 Prefer A / Prefer B）</li>
        <li>写 1-3 句理由</li>
        <li>选择下一步动作</li>
        <li>打 1-5 的 confidence 分</li>
      </ol>
    </div>
  `));

  w.append(card("Next-Action 选项说明", `
    <div class="consent-grid">
      <div class="consent-item"><div class="consent-icon">🔍</div><div><strong>verify or inspect the source</strong>：检查原始来源材料</div></div>
      <div class="consent-item"><div class="consent-icon">🔄</div><div><strong>ask AI to regenerate with supporting evidence</strong>：要求 AI 重新生成并附上证据</div></div>
      <div class="consent-item"><div class="consent-icon">✏️</div><div><strong>weaken the claim wording</strong>：编辑输出，使用更谨慎的措辞</div></div>
      <div class="consent-item"><div class="consent-icon">🚫</div><div><strong>flag and do not use this output</strong>：标记为不可用</div></div>
      <div class="consent-item"><div class="consent-icon">✅</div><div><strong>accept with minor edits</strong>：接受输出，仅做最小修改</div></div>
    </div>
  `));

  const btns = el("div", "button-row");
  btns.append(btn("我已了解，开始前测", "primary", () => {
    S.stage = "pretest";
    S.pretestIndex = 0;
    S.pretestResponses = [];
    S.pretestStartedAt = Date.now();
    startTimer();
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
      S.stage = "profile";
      stopTimer();
    } else {
      S.stage = "interview";
      stopTimer();
    }
    render();
    return;
  }

  S.currentItemStartedAt = S.currentItemStartedAt || Date.now();
  if (!timerInterval) startTimer();

  $screen.innerHTML = "";
  const container = el("div", "screen-stack");

  // Header metrics
  const hdr = el("div", "metric-grid");
  const phaseTag = phase === "pretest" ? "pretest" : "posttest";
  hdr.innerHTML = `
    <div class="metric"><div class="label">Phase</div><div class="value"><span class="phase-tag ${phaseTag}">${phase}</span></div></div>
    <div class="metric"><div class="label">Item</div><div class="value">${item.id}</div></div>
    <div class="metric"><div class="label">Category</div><div class="value">${item.category}</div></div>
    <div class="metric"><div class="label">Progress</div><div class="value">${idx + 1} / ${items.length}</div></div>
  `;
  container.append(hdr);

  // AI-free reminder
  const reminderText = phase === "pretest"
    ? "前测阶段：请仅基于屏幕上的材料独立判断，不得使用任何 AI 或搜索工具。"
    : "后测阶段：请独立判断，不会有任何 AI 辅助。";
  container.append(createCallout(reminderText, "warn-callout"));

  // Split layout
  const layout = el("div", "split-grid");

  // Left: stimulus
  const left = el("div", "screen-stack");
  left.append(card("Writing Goal 写作目标", `<div class="answer-box">${esc(item.writing_goal_zh)}</div>`));
  left.append(card("AI Output", renderAiOutput(item)));
  left.append(card("Evidence Card 证据卡", renderEvidence(item.evidence_card)));
  left.append(card("Prompt 题目要求", `<div class="answer-box">${esc(item.participant_prompt_zh)}</div>`));

  // Right: response form
  const right = el("div", "screen-stack");
  right.append(createResponseForm(item, phase));

  layout.append(left, right);
  container.append(layout);
  $screen.append(container);
}

function renderAiOutput(item) {
  if (item.ai_answer) {
    return `<div class="answer-box">${esc(item.ai_answer)}</div>`;
  }
  return `
    <div class="field-stack" style="gap:10px">
      <div class="answer-box"><strong>Answer A</strong><br>${esc(item.ai_answers.A)}</div>
      <div class="answer-box"><strong>Answer B</strong><br>${esc(item.ai_answers.B)}</div>
    </div>
  `;
}

function renderEvidence(ec) {
  const bullets = ec.bullets.map(b => `<li>${esc(b)}</li>`).join("");
  return `<div class="answer-box"><strong>${esc(ec.title)}</strong><ul class="list-tight">${bullets}</ul></div>`;
}

function createResponseForm(item, phase) {
  const form = el("form", "card field-stack");
  form.innerHTML = `<h2 class="card-title">Your Response 你的回答</h2>`;

  const opts = item.response_mode === "comparative_judgment"
    ? S.materials.response_schema.comparative_judgment
    : S.materials.response_schema.single_judgment;

  form.append(createRadioGroup("Judgment 判断", "judgment", opts));
  form.append(createTextArea("Reason 理由", "reason", "用 1-3 句话说明你为什么这样判断。"));
  form.append(createSelect("Next Action 下一步", "next_action", S.materials.response_schema.next_action));
  form.append(createRadioGroup("Confidence 信心", "confidence",
    ["1 - very unsure", "2 - somewhat unsure", "3 - not sure", "4 - fairly confident", "5 - very confident"]
  ));

  const errNode = el("div", "error-text");
  errNode.hidden = true;
  form.append(errNode);

  const actions = el("div", "button-row");
  actions.append(btn("保存并继续 →", "primary", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const judgment = fd.get("judgment");
    const reason = (fd.get("reason") || "").trim();
    const nextAction = fd.get("next_action");
    const confidence = fd.get("confidence");

    if (!judgment || !reason || !nextAction || !confidence) {
      errNode.hidden = false;
      errNode.textContent = "请完成所有四个字段再继续。";
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
    } else {
      S.posttestResponses.push(resp);
      S.posttestIndex++;
    }
    S.currentItemStartedAt = Date.now();
    render();
  }));
  form.append(actions);
  return form;
}

// ── Profile Screen ──
function renderProfile() {
  stopTimer();
  const rec = S.profileRecommendation;
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card("前测诊断结果", `
    <div class="callout">系统基于 judgment accuracy + action quality 做初步推荐。Explanation quality 需后续用 rubric 人工评分。</div>
    <div class="metric-grid" style="margin-top:14px">
      ${rec.categorySummaries.map(s => `
        <div class="metric">
          <div class="label">${esc(s.category)}</div>
          <div class="value">${s.score} / ${s.maxScore}</div>
          <div class="category-bar"><div class="category-bar-fill ${s.score <= 1 ? 'low' : s.score <= 2 ? 'mid' : 'high'}" style="width:${(s.score / s.maxScore * 100).toFixed(0)}%"></div></div>
        </div>
      `).join("")}
    </div>
    <p style="margin-top:14px"><strong>推荐 targeted profiles:</strong> ${rec.profiles.map(p => `<code>${p}</code>`).join(", ")}</p>
  `));

  const profileCard = el("div", "card field-stack");
  profileCard.innerHTML = `
    <h2 class="card-title">Profile Override（Operator 操作）</h2>
    <p class="helper-text compact">系统已自动选取最弱的两个 categories。如果与你的直觉不符，可以手动调整并记录。</p>
  `;

  S.materials.profiles.forEach(profile => {
    const label = el("label", "checkbox-row");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "profile";
    input.value = profile;
    input.checked = S.selectedProfiles.includes(profile);
    const span = document.createElement("span");
    span.textContent = profile;
    label.append(input, span);
    profileCard.append(label);
  });

  const overrideNote = el("div", "field-stack");
  overrideNote.innerHTML = `
    <label for="override-note">Override 备注（如有调整请说明原因）</label>
    <textarea id="override-note" placeholder="如：explanation text 显示该学生在 source-verification 上比分数反映的更弱"></textarea>
  `;
  profileCard.append(overrideNote);

  const actions = el("div", "button-row");
  actions.append(btn("确认 Profile，进入干预练习", "primary", () => {
    const checked = [...profileCard.querySelectorAll('input[name="profile"]:checked')].map(n => n.value);
    if (checked.length !== 2) { alert("请选择恰好两个 profiles"); return; }
    S.selectedProfiles = checked;
    const noteEl = document.getElementById("override-note");
    S.profileOverride = noteEl && noteEl.value.trim() ? noteEl.value.trim() : false;
    S.stage = "scenes";
    S.sceneIndex = 0;
    S.sceneResponses = [];
    S.operatorNotes = [];
    startTimer();
    render();
  }));
  actions.append(btn("重新测试", "ghost", () => { resetStudy(); render(); }));
  profileCard.append(actions);
  w.append(profileCard);
  $screen.append(w);
}

// ── Scene Screen ──
function renderScene() {
  const scenes = getSelectedScenes();
  const scene = scenes[S.sceneIndex];
  if (!scene) {
    S.stage = "transition";
    stopTimer();
    render();
    return;
  }

  S.currentItemStartedAt = S.currentItemStartedAt || Date.now();
  const filled = fillSlots(scene);
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card("Intervention Scene", `
    <div class="pill-row">
      <span class="pill active">${esc(scene.scene_id)}</span>
      <span class="pill">${esc(scene.role)}</span>
      <span class="phase-tag intervention">Scene ${S.sceneIndex + 1}/${scenes.length}</span>
    </div>
    <p class="subtitle compact" style="margin-top:10px">${esc(filled.learningObjective || "")}</p>
  `));

  const sceneCard = el("div", "card field-stack");
  sceneCard.innerHTML = `<h2 class="card-title">Script</h2>`;

  const box = el("div", "scene-box");
  box.innerHTML = filled.lines.map(l => `<p>${esc(l)}</p>`).join("");
  sceneCard.append(box);

  const taskLabel = el("p", "prompt-label compact");
  taskLabel.style.marginTop = "12px";
  taskLabel.textContent = "Learner Task: " + filled.task;
  sceneCard.append(taskLabel);

  const ta = document.createElement("textarea");
  ta.id = "scene-response";
  ta.placeholder = "输入参与者的回答...";
  sceneCard.append(ta);

  // Operator real-time observation note
  const obsLabel = el("p", "prompt-label compact");
  obsLabel.style.marginTop = "8px";
  obsLabel.textContent = "Operator Observation Note（30s 观察记录）";
  sceneCard.append(obsLabel);
  const obsTA = document.createElement("textarea");
  obsTA.id = "obs-note";
  obsTA.placeholder = '如："主动提问为什么 metadata 不匹配" 或 "只看了一眼就写了很短的回答"';
  obsTA.style.minHeight = "60px";
  sceneCard.append(obsTA);

  const actions = el("div", "button-row");
  actions.append(btn("保存 Scene 并继续 →", "primary", () => {
    const learnerResp = document.getElementById("scene-response").value.trim();
    const obsNote = document.getElementById("obs-note").value.trim();
    S.sceneResponses.push({
      participant_id: S.participantId,
      scene_id: scene.scene_id,
      targeted_profile: filled.targetedProfile,
      source_failed_item: filled.failedItemId,
      learner_response_text: learnerResp,
      response_time_sec: Math.round((Date.now() - S.currentItemStartedAt) / 1000),
      completion_flag: learnerResp.length > 0
    });
    if (obsNote) {
      S.operatorNotes.push({ scene_id: scene.scene_id, note: obsNote });
    }
    S.sceneIndex++;
    S.currentItemStartedAt = Date.now();
    render();
  }));
  sceneCard.append(actions);
  w.append(sceneCard);
  $screen.append(w);
}

// ── Transition Screen ──
function renderTransition() {
  stopTimer();
  // Prepare randomized posttest
  S.posttestItemOrder = shuffleArray(getItems("posttest"));
  S.posttestIndex = 0;
  S.posttestResponses = [];

  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  w.append(card("过渡提示", `
    <div class="transition-callout">
      <p style="font-size:1.3rem;font-weight:700;margin:0 0 12px">接下来的题目需要你独立判断</p>
      <p style="margin:0">不会有任何 AI 辅助。请像自己审稿一样作答。</p>
      <p style="margin:10px 0 0;font-size:0.95rem;color:var(--muted)">Next, you will judge independently. There will be no AI assistance.</p>
    </div>
  `));

  const btns = el("div", "button-row");
  btns.append(btn("我已准备好，开始后测", "primary", () => {
    S.posttestStartedAt = Date.now();
    S.stage = "posttest";
    startTimer();
    render();
  }));
  w.append(btns);
  $screen.append(w);
}

// ── Interview Screen ──
function renderInterview() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  const questions = [
    "哪个 scene 最有帮助？为什么？",
    "你现在最常用的判断规则是什么？",
    "哪种错误你仍然最容易犯？",
    "如果把这个系统嵌入真实课程，你会在哪一步使用它？",
    "在刚才的过程中，有没有哪个环节让你感到困惑或不确定？",
    "如果让你删掉一个环节，你会删哪个？为什么？"
  ];

  w.append(card("短访谈（8-10 分钟）", `
    <span class="phase-tag interview">Interview</span>
    <p style="margin-top:10px">请口头回答以下问题，实验员记录要点。</p>
  `));

  const formCard = el("div", "card field-stack");
  questions.forEach((q, i) => {
    const qBlock = el("div", "interview-question");
    qBlock.innerHTML = `<div class="q-number">Q${i + 1}</div><p style="margin:6px 0 10px;font-weight:600">${esc(q)}</p>`;
    const ta = document.createElement("textarea");
    ta.name = `interview_q${i}`;
    ta.placeholder = "记录参与者的回答要点...";
    ta.style.minHeight = "70px";
    ta.value = S.interviewResponses[`q${i}`] || "";
    qBlock.append(ta);
    formCard.append(qBlock);
  });

  const actions = el("div", "button-row");
  actions.append(btn("完成访谈，进入结束页", "primary", () => {
    const tas = formCard.querySelectorAll("textarea");
    tas.forEach((ta, i) => { S.interviewResponses[`q${i}`] = ta.value.trim(); });
    S.stage = "debrief";
    render();
  }));
  formCard.append(actions);
  w.append(formCard);
  $screen.append(w);
}

// ── Debrief / Export Screen ──
function renderDebrief() {
  stopTimer();
  $screen.innerHTML = "";
  const w = el("div", "screen-stack");

  // Debrief message
  w.append(card("感谢参与", `
    <p>感谢你的参与！本研究中的部分 citation 与 source 情景是为实验目的而设计的 <strong>controlled materials</strong>，其中包含故意构造的错误样例，用于测试 AI judgment，而不代表真实可引用文献。</p>
  `));

  // Summary stats
  const totalTime = S.sessionStartedAt ? Math.round((Date.now() - S.sessionStartedAt) / 60000) : 0;
  w.append(card("Session Summary", `
    <div class="metric-grid">
      <div class="metric"><div class="label">Participant</div><div class="value">${esc(S.participantId)}</div></div>
      <div class="metric"><div class="label">Total time</div><div class="value">${totalTime} min</div></div>
      <div class="metric"><div class="label">Pretest</div><div class="value">${S.pretestResponses.length} items</div></div>
      <div class="metric"><div class="label">Scenes</div><div class="value">${S.sceneResponses.length} scenes</div></div>
      <div class="metric"><div class="label">Posttest</div><div class="value">${S.posttestResponses.length} items</div></div>
      <div class="metric"><div class="label">Profiles</div><div class="value">${S.selectedProfiles.join(", ")}</div></div>
    </div>
  `));

  // Interaction pattern annotation
  const codingCard = el("div", "card field-stack");
  codingCard.innerHTML = `<h2 class="card-title">Interaction Pattern Annotation（Operator）</h2>
    <p class="helper-text compact">根据 codebook 为该参与者标注主要交互模式。</p>`;
  const patterns = S.materials.interaction_pattern_codebook.map(e => e.code);
  codingCard.append(createSelect("Primary pattern", "primary_pattern", patterns));
  codingCard.append(createSelect("Secondary pattern (optional)", "secondary_pattern", patterns));
  codingCard.append(createTextArea("Evidence note", "pattern_note", "简要记录编码依据"));
  w.append(codingCard);

  // Export buttons
  const actions = el("div", "button-row");
  actions.append(btn("下载 Session JSON", "primary", () => {
    syncCoding();
    downloadJson(buildExport());
  }));
  actions.append(btn("复制 JSON 到剪贴板", "secondary", async () => {
    syncCoding();
    await navigator.clipboard.writeText(JSON.stringify(buildExport(), null, 2));
    alert("JSON 已复制到剪贴板！");
  }));
  actions.append(btn("开始新参与者", "ghost", () => { resetStudy(); render(); }));
  w.append(actions);

  // Preview
  const preview = el("div", "card");
  preview.innerHTML = `<h2 class="card-title">Export Preview</h2><div class="answer-box" style="max-height:400px;overflow:auto;font-size:0.85rem">${esc(JSON.stringify(buildExport(), null, 2))}</div>`;
  w.append(preview);

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
    if (!catScores[cat]) catScores[cat] = { category: cat, score: 0, maxScore: 0, decisionErrors: 0 };
    catScores[cat].maxScore += 2; // judgment + action
    let s = 0;
    if (item.gold_label.judgment.includes(resp.judgment)) s += 1;
    else catScores[cat].decisionErrors++;
    if (item.gold_label.next_action.includes(resp.next_action)) s += 1;
    catScores[cat].score += s;
  }

  const summaries = Object.values(catScores).sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    if (a.decisionErrors !== b.decisionErrors) return b.decisionErrors - a.decisionErrors;
    if (a.category === "source-verification") return -1;
    if (b.category === "source-verification") return 1;
    return 0;
  });

  const profiles = summaries.slice(0, 2).map(s => categoryToProfile[s.category]).filter(Boolean);

  return {
    method: "auto-score: judgment + action (explanation scored later with rubric)",
    categorySummaries: summaries,
    profiles
  };
}

// ── Scene helpers ──
function getSelectedScenes() {
  return S.selectedProfiles.flatMap(p => S.materials.scene_sequences[p] || []);
}

function fillSlots(scene) {
  const targetedProfile = profileFromSceneId(scene.scene_id);
  const sourceResp = findFailedResponse(targetedProfile);
  const sourceItem = S.materials.items.find(i => i.id === sourceResp?.item_id);
  const gap = sourceItem?.gold_label.reason_anchor || "the answer exceeded what the evidence could support";
  const lines = scene.script_lines.map(l =>
    l.replace(/\{failed_item_id\}/g, sourceResp?.item_id || "PRE_UNKNOWN")
     .replace(/\{evidence_gap\}/g, gap)
  );
  return {
    targetedProfile,
    failedItemId: sourceResp?.item_id || "PRE_UNKNOWN",
    learningObjective: scene.learning_objective_zh,
    lines,
    task: scene.learner_task_zh
  };
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
function getItems(phase) {
  return S.materials.items.filter(i => i.phase === phase);
}

function isTargeted(category) {
  const profile = categoryToProfile[category];
  return S.selectedProfiles.includes(profile);
}

function buildExport() {
  return {
    study_id: S.materials.study_id,
    version: S.materials.version,
    participant_id: S.participantId,
    session_started_at: S.sessionStartedAt ? new Date(S.sessionStartedAt).toISOString() : null,
    selected_profiles: S.selectedProfiles,
    profile_override: S.profileOverride,
    profile_recommendation: S.profileRecommendation,
    interaction_pattern_annotation: S.interactionPattern,
    operator_observation_notes: S.operatorNotes,
    pretest_responses: S.pretestResponses,
    scene_responses: S.sceneResponses,
    posttest_responses: S.posttestResponses,
    posttest_item_order: S.posttestItemOrder.map(i => i.id),
    interview_responses: S.interviewResponses,
    exported_at: new Date().toISOString()
  };
}

function syncCoding() {
  const p = document.getElementById("primary_pattern");
  const s = document.getElementById("secondary_pattern");
  const n = document.getElementById("pattern_note");
  if (p) S.interactionPattern.primary = p.value;
  if (s) S.interactionPattern.secondary = s.value;
  if (n) S.interactionPattern.note = n.value.trim();
}

function downloadJson(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${S.participantId || "participant"}_session.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function resetStudy() {
  Object.assign(S, {
    stage: "consent", pretestIndex: 0, posttestIndex: 0, sceneIndex: 0,
    pretestResponses: [], posttestResponses: [], sceneResponses: [],
    interviewResponses: {}, interactionPattern: { primary: "", secondary: "", note: "" },
    operatorNotes: [], profileOverride: false,
    pretestStartedAt: null, posttestStartedAt: null, currentItemStartedAt: null,
    sessionStartedAt: null, selectedProfiles: [], profileRecommendation: null,
    posttestItemOrder: []
  });
  stopTimer();
}

// ── DOM Helpers ──
function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function card(title, html) {
  const c = el("div", "card");
  c.innerHTML = `<h2 class="card-title">${title}</h2>${html}`;
  return c;
}

function createCallout(text, cls) {
  const c = el("div", "callout " + (cls || ""));
  c.innerHTML = text;
  return c;
}

function createRadioGroup(labelText, name, values) {
  const w = el("div", "field-stack");
  const label = el("div", "prompt-label");
  label.textContent = labelText;
  w.append(label);
  const grid = el("div", "option-grid");
  values.forEach(v => {
    const frag = radioTpl.content.cloneNode(true);
    const input = frag.querySelector("input");
    const span = frag.querySelector("span");
    input.name = name;
    input.value = v;
    span.textContent = v;
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

function createSelect(labelText, name, values) {
  const w = el("div", "field-stack");
  const label = el("label");
  label.htmlFor = name;
  label.textContent = labelText;
  const select = document.createElement("select");
  select.name = name; select.id = name;
  const ph = document.createElement("option");
  ph.value = ""; ph.textContent = "— Select —"; ph.selected = true; ph.disabled = true;
  select.append(ph);
  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v; opt.textContent = v;
    select.append(opt);
  });
  w.append(label, select);
  return w;
}

function btn(text, cls, onClick) {
  const b = document.createElement("button");
  b.type = "button"; b.className = cls; b.textContent = text;
  b.addEventListener("click", onClick);
  return b;
}

function renderError() {
  $screen.innerHTML = `
    <div class="screen-stack">
      <div class="callout warn-callout">
        <strong>无法加载实验材料</strong>
        <p class="compact">${esc(S.errors || "Unknown error")}</p>
        <p class="compact">请在 plan 目录运行 <code>python3 -m http.server</code>，然后通过 <code>http://localhost:8000/prototype/</code> 打开。</p>
      </div>
    </div>
  `;
}

function esc(t) {
  return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function escAttr(t) {
  return esc(t).replace(/"/g,"&quot;");
}
