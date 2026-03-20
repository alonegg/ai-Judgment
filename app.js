/* ============================================================
   AI Judgment Micro-Intervention Pilot — v2
   Full experiment flow:
   consent → warmup → pretest(8) → profile → scenes(4) → transition → posttest(8) → interview → debrief/export
   ============================================================ */

// ── Language ──
const LANG = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
const MATERIALS_PATH = LANG === "en" ? "./materials_en.json" : "./materials_v1.json";

const T = LANG === "en" ? {
  // Badge
  badge_welcome: "Welcome", badge_warmup: "Warm-up", badge_pretest: "Pretest",
  badge_profile: "Profile", badge_scene: "Scene", badge_transition: "Transition",
  badge_posttest: "Posttest", badge_interview: "Interview", badge_debrief: "Export",
  // Consent
  consent_title: "Welcome to This Study",
  consent_intro: "This study examines how university students judge the trustworthiness of generative AI outputs in bounded knowledge tasks such as research reports, financial analysis, data processing, and history/humanities summaries.",
  consent_task: "You will see task prompts, AI-generated answers, and facts packages. Your task is not to polish the text, but to judge whether the AI output can be used directly, identify problems, and decide on a next action. Not every AI output is wrong: some should be rejected, some revised, and some cautiously retained.",
  consent_flow_title: "Experiment Flow",
  consent_pills: ["Consent", "Warm-up", "Pre ×8", "Profiling", "Intervention ×4", "Post ×8", "Interview", "End"],
  consent_duration: "Estimated duration: <strong>75–90 minutes</strong>",
  consent_info_title: "Informed Consent",
  consent_info: [
    "We will record your item choices, brief explanations, confidence ratings, and completion times.",
    "We will not assess your language proficiency or use results for course grades.",
    "All data will be anonymized and used only for academic research purposes.",
    "You may withdraw from the study at any time without explanation."
  ],
  consent_setup_title: "Session Setup", consent_pid_label: "Participant ID",
  consent_pid_placeholder: "P01", consent_pid_help: "Anonymous ID assigned by the researcher, e.g. <code>P01</code>",
  consent_btn: "I have read and agree — Start experiment",
  consent_pid_alert: "Please enter a Participant ID",
  // Warmup
  warmup_title: "Warm-up Exercise",
  warmup_intro: "Before the formal test, let's go through one example to help you get familiar with the response format. In the real study, not every item is problematic.",
  warmup_goal_title: "Example: Writing Goal",
  warmup_goal: 'You are writing a short user-research summary:<br>"Some interviewees use AI tools during early planning."',
  warmup_ai_title: "Example: AI Answer",
  warmup_ai: '"Research proves that all users benefit equally from AI planning tools."',
  warmup_ev_title: "Example: Evidence Card",
  warmup_ev_bullets: [
    "A small interview study reports that some participants found AI useful for early planning.",
    "The study does not cover all users.",
    "The study does not show equal benefit across participants."
  ],
  warmup_explain_title: "Walkthrough",
  warmup_judgment: '<strong>Reasonable judgment:</strong> <code>Revise</code>',
  warmup_reason: 'Because "all users", "benefit equally", and "proves" in the AI answer go beyond what the facts package states.',
  warmup_next_action: 'A good next action would be <code>weaken the claim wording</code>.',
  warmup_steps_label: "Four response steps:",
  warmup_steps: ["Make a judgment (Accept / Revise / Reject or Prefer A / Prefer B)", "Write 1–3 sentences of reasoning", "Choose a next action", "Rate your confidence 1–5"],
  warmup_actions_title: "Next-Action Options",
  warmup_actions: [
    ["1", "<strong>verify or inspect the source</strong>: check the original source material"],
    ["2", "<strong>ask AI to regenerate with supporting evidence</strong>: request AI to regenerate with evidence"],
    ["3", "<strong>weaken the claim wording</strong>: edit the output with more cautious wording"],
    ["4", "<strong>flag and do not use this output</strong>: mark as unusable"],
    ["5", "<strong>accept with minor edits</strong>: accept the output with minimal text edits"]
  ],
  warmup_btn: "I understand — Start pretest",
  // Item screen
  item_phase: "Phase", item_id: "Item", item_category: "Category", item_progress: "Progress",
  phase_pretest: "Pretest", phase_posttest: "Posttest",
  reminder_pretest: "Pretest: Please judge independently based on the on-screen materials only. Do not use any AI or search tools.",
  reminder_posttest: "Posttest: Please judge independently. There will be no AI assistance.",
  card_goal: "Writing Goal", card_ai: "AI Output", card_evidence: "Evidence Card", card_prompt: "Task Prompt",
  answer_a: "Answer A", answer_b: "Answer B",
  form_title: "Your Response",
  label_judgment: "Judgment", label_reason: "Reason", label_next_action: "Next Action", label_confidence: "Confidence",
  reason_placeholder: "Explain your judgment in 1–3 sentences.",
  confidence_opts: ["1 - very unsure", "2 - somewhat unsure", "3 - not sure", "4 - fairly confident", "5 - very confident"],
  btn_save_next: "Save & Continue →",
  err_incomplete: "Please complete all four fields before continuing.",
  // Profile
  profile_title: "Pretest Diagnostic Results",
  profile_callout: "System recommendation based on judgment accuracy + action quality. Explanation quality will be scored later with a rubric.",
  profile_recommend: "Recommended targeted profiles:",
  profile_override_title: "Profile Override (Operator)",
  profile_override_help: "The system selected the two weakest categories. Override manually if needed.",
  profile_override_note_label: "Override note (explain if adjusted)",
  profile_override_note_placeholder: "e.g. Explanation text shows the student is weaker in source-verification than the score suggests",
  profile_btn: "Confirm profiles — Start intervention", profile_btn_reset: "Restart test",
  profile_alert: "Please select exactly two profiles",
  // Scene
  scene_title: "Intervention Scene", scene_script_title: "Script",
  scene_recap_title: "Scene Recap", scene_issue_title: "Key Issue",
  scene_task_label: "Learner Task: ", scene_response_placeholder: "Enter the participant's response...",
  scene_obs_label: "Operator Observation Note (30s quick note)",
  scene_obs_placeholder: "e.g. \"Actively asked why the metadata didn't match\" or \"Glanced briefly and wrote a very short answer\"",
  scene_btn: "Save scene & Continue →",
  // Transition
  transition_title: "Transition Prompt",
  transition_main: "The following items require your independent judgment",
  transition_sub: "There will be no AI assistance. Please respond as if you were reviewing a manuscript.",
  transition_btn: "I'm ready — Start posttest",
  // Interview
  interview_title: "Short Interview (8–10 min)", interview_tag: "Interview",
  interview_intro: "Please answer the following questions orally; the researcher will record key points.",
  interview_questions: [
    "Which scene was most helpful? Why?",
    "What is the judgment rule you would use most often now?",
    "What type of error are you still most likely to make?",
    "If this system were embedded in a real course, at which step would you use it?",
    "Was there any part of the process that felt confusing or uncertain?",
    "If you could remove one step, which would it be? Why?"
  ],
  interview_q_prefix: "Q", interview_placeholder: "Record key points of the participant's answer...",
  interview_btn: "Finish interview — Go to summary",
  // Debrief
  debrief_title: "Thank You",
  debrief_msg: "Thank you for participating! Some citations and source scenarios in this study were <strong>controlled materials</strong> designed for experimental purposes, including deliberately constructed errors to test AI judgment — they do not represent real citable references.",
  summary_title: "Session Summary",
  summary_participant: "Participant", summary_time: "Total time", summary_min: "min",
  summary_pretest: "Pretest", summary_scenes: "Scenes", summary_posttest: "Posttest", summary_profiles: "Profiles",
  summary_items: "items", summary_scenes_unit: "scenes",
  coding_title: "Interaction Pattern Annotation (Operator)",
  coding_help: "Annotate the primary interaction pattern for this participant based on the codebook.",
  coding_primary: "Primary pattern", coding_secondary: "Secondary pattern (optional)", coding_evidence: "Evidence note",
  coding_evidence_placeholder: "Brief note on coding rationale",
  btn_download: "Download Session JSON", btn_copy: "Copy to clipboard", btn_new: "Start new participant",
  copy_alert: "JSON copied to clipboard!",
  preview_title: "Export Preview",
  // Error
  error_title: "Cannot load study materials", error_unknown: "Unknown error",
  error_help: "Please run <code>python3 -m http.server</code> in the project directory and open via <code>http://localhost:8000/index.html</code>.",
  // Select
  select_placeholder: "— Select —",
  // Category & profile labels
  cat_label: {"hallucinated-citation": "Hallucinated Citation", "source-verification": "Source Verification", "trust-calibration": "Trust Calibration", "scope-generalization": "Scope Generalization"},
  profile_label: {"hallucination-weak": "Hallucination-weak", "verification-weak": "Verification-weak", "trust-calibration-weak": "Trust-calibration-weak", "scope-generalization-weak": "Scope-generalization-weak"}
} : {
  // Chinese (default)
  badge_welcome: "欢迎", badge_warmup: "热身", badge_pretest: "前测",
  badge_profile: "诊断", badge_scene: "场景", badge_transition: "过渡",
  badge_posttest: "后测", badge_interview: "访谈", badge_debrief: "导出",
  consent_title: "欢迎参加本研究",
  consent_intro: "本研究关注大学生在使用生成式 AI 处理有边界的知识任务时，如何判断 AI 输出是否可信。题目会覆盖调研报告、金融分析、数据处理和历史人文等语境。",
  consent_task: "在本研究中，你将看到若干题干、AI 生成的回答、以及配套事实情况。这里的题干就是你给 AI 的 prompt 或写作需求。你的任务不是「把句子写得更漂亮」，而是判断 AI 输出能不能直接用、问题出在哪里、下一步应该怎么做。并非每个 AI 输出都有问题；有些应拒绝，有些应修改，也有些可以谨慎保留。",
  consent_flow_title: "实验流程概览",
  consent_pills: ["同意书", "热身", "前测 ×8", "个性化诊断", "干预练习 ×4", "后测 ×8", "访谈", "结束"],
  consent_duration: "总时长约 <strong>75-90 分钟</strong>",
  consent_info_title: "知情同意",
  consent_info: [
    "我们会记录你的题目选择、简短解释、信心评分和完成时间。",
    "我们不会评估你的语言水平，也不会把结果用于课程成绩。",
    "所有数据将匿名处理，仅用于学术研究目的。",
    "你可以随时退出实验，无需说明理由。"
  ],
  consent_setup_title: "实验设置", consent_pid_label: "参与者编号",
  consent_pid_placeholder: "P01", consent_pid_help: "由实验员分配的匿名编号，如 <code>P01</code>",
  consent_btn: "我已阅读并同意，开始实验",
  consent_pid_alert: "请输入参与者编号",
  warmup_title: "热身练习",
  warmup_intro: "在正式测试前，我们先用一道示例帮助你熟悉答题格式。正式题目里并不是每一道都有问题。",
  warmup_goal_title: "示例：题干",
  warmup_goal: '我在写一段用户调研总结，我输入的 prompt 是：<br>「部分受访者会在早期规划阶段使用 AI 工具。」',
  warmup_ai_title: "示例：AI 输出",
  warmup_ai: '「研究证明所有用户都同等受益于 AI 规划工具。」',
  warmup_ev_title: "示例：事实情况",
  warmup_ev_bullets: [
    "一项小规模访谈研究发现，部分受访者认为 AI 对早期规划有帮助。",
    "该研究并未覆盖所有用户。",
    "该研究没有证明不同受访者之间存在同等收益。"
  ],
  warmup_explain_title: "示例讲解",
  warmup_judgment: '<strong>合理判断：</strong><code>修改</code>',
  warmup_reason: '因为 AI 的回答中「所有用户」「同等受益」「证明」都超出了事实情况给出的信息。',
  warmup_next_action: '下一步动作可以选择 <code>弱化论述措辞</code>。',
  warmup_steps_label: "答题四步骤：",
  warmup_steps: ["做出判断（接受 / 修改 / 拒绝 或 选择 A / 选择 B）", "写 1-3 句理由", "选择下一步动作", "打 1-5 的信心分"],
  warmup_actions_title: "下一步动作选项说明",
  warmup_actions: [
    ["1", "<strong>核查或检视原始来源</strong>：检查原始来源材料"],
    ["2", "<strong>要求 AI 重新生成并附上证据</strong>：要求 AI 重新生成并附上支持性证据"],
    ["3", "<strong>弱化论述措辞</strong>：编辑输出，使用更谨慎的措辞"],
    ["4", "<strong>标记为不可用</strong>：标记该输出为不可用，不进行进一步使用"],
    ["5", "<strong>接受并做小幅修改</strong>：接受输出，仅做最小文本修改"]
  ],
  warmup_btn: "我已了解，开始前测",
  item_phase: "阶段", item_id: "题号", item_category: "类别", item_progress: "进度",
  phase_pretest: "前测", phase_posttest: "后测",
  reminder_pretest: "前测阶段：请仅基于屏幕上的材料独立判断，不得使用任何 AI 或搜索工具。",
  reminder_posttest: "后测阶段：请独立判断，不会有任何 AI 辅助。",
  card_goal: "题干", card_ai: "AI 输出", card_evidence: "事实情况", card_prompt: "作答要求",
  answer_a: "答案 A", answer_b: "答案 B",
  form_title: "你的回答",
  label_judgment: "判断", label_reason: "理由", label_next_action: "下一步动作", label_confidence: "信心程度",
  reason_placeholder: "用 1-3 句话说明你为什么这样判断。",
  confidence_opts: ["1 - 非常不确定", "2 - 比较不确定", "3 - 不太确定", "4 - 比较确定", "5 - 非常确定"],
  btn_save_next: "保存并继续 →",
  err_incomplete: "请完成所有四个字段再继续。",
  profile_title: "前测诊断结果",
  profile_callout: "系统基于判断准确率和动作选择质量做初步推荐。解释质量需后续用评分标准人工评分。",
  profile_recommend: "推荐干预方向：",
  profile_override_title: "诊断覆盖（操作员）",
  profile_override_help: "系统已自动选取最弱的两个类别。如果与你的直觉不符，可以手动调整并记录。",
  profile_override_note_label: "覆盖备注（如有调整请说明原因）",
  profile_override_note_placeholder: "如：解释文本显示该学生在来源核查上比分数反映的更弱",
  profile_btn: "确认诊断，进入干预练习", profile_btn_reset: "重新测试",
  profile_alert: "请选择恰好两个类别",
  scene_title: "干预场景", scene_script_title: "脚本内容",
  scene_recap_title: "场景回顾", scene_issue_title: "关键问题",
  scene_task_label: "学习任务：", scene_response_placeholder: "输入参与者的回答...",
  scene_obs_label: "操作员观察记录（30秒快记）",
  scene_obs_placeholder: '如：「主动提问为什么元数据不匹配」或「只看了一眼就写了很短的回答」',
  scene_btn: "保存场景并继续 →",
  transition_title: "过渡提示",
  transition_main: "接下来的题目需要你独立判断",
  transition_sub: "不会有任何 AI 辅助。请像自己审稿一样作答。",
  transition_btn: "我已准备好，开始后测",
  interview_title: "短访谈（8-10 分钟）", interview_tag: "访谈",
  interview_intro: "请口头回答以下问题，实验员记录要点。",
  interview_questions: [
    "哪个场景最有帮助？为什么？",
    "你现在最常用的判断规则是什么？",
    "哪种错误你仍然最容易犯？",
    "如果把这个系统嵌入真实课程，你会在哪一步使用它？",
    "在刚才的过程中，有没有哪个环节让你感到困惑或不确定？",
    "如果让你删掉一个环节，你会删哪个？为什么？"
  ],
  interview_q_prefix: "问题", interview_placeholder: "记录参与者的回答要点...",
  interview_btn: "完成访谈，进入结束页",
  debrief_title: "感谢参与",
  debrief_msg: "感谢你的参与！本研究中的部分引用与来源情景是为实验目的而设计的<strong>控制材料</strong>，其中包含故意构造的错误样例，用于测试 AI 判断能力，而不代表真实可引用文献。",
  summary_title: "实验总结",
  summary_participant: "参与者", summary_time: "总时长", summary_min: "分钟",
  summary_pretest: "前测", summary_scenes: "场景", summary_posttest: "后测", summary_profiles: "干预方向",
  summary_items: "题", summary_scenes_unit: "个",
  coding_title: "交互模式标注（操作员）",
  coding_help: "根据编码手册为该参与者标注主要交互模式。",
  coding_primary: "主要模式", coding_secondary: "次要模式（可选）", coding_evidence: "编码依据",
  coding_evidence_placeholder: "简要记录编码依据",
  btn_download: "下载实验数据", btn_copy: "复制到剪贴板", btn_new: "开始新参与者",
  copy_alert: "数据已复制到剪贴板！",
  preview_title: "导出预览",
  error_title: "无法加载实验材料", error_unknown: "未知错误",
  error_help: "请在项目目录运行 <code>python3 -m http.server</code>，然后通过 <code>http://localhost:8000/index.html</code> 打开。",
  select_placeholder: "— 请选择 —",
  cat_label: {"hallucinated-citation": "虚构引用识别", "source-verification": "来源核查", "trust-calibration": "可信度校准", "scope-generalization": "范围泛化识别"},
  profile_label: {"hallucination-weak": "虚构引用薄弱", "verification-weak": "来源核查薄弱", "trust-calibration-weak": "可信度校准薄弱", "scope-generalization-weak": "范围泛化薄弱"}
};

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

// categoryLabel and profileLabel are now in T.cat_label and T.profile_label

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
    consent: T.badge_welcome,
    warmup: T.badge_warmup,
    pretest: `${T.badge_pretest} ${S.pretestIndex + 1}/${getItems("pretest").length}`,
    profile: T.badge_profile,
    scenes: `${T.badge_scene} ${S.sceneIndex + 1}/${getSelectedScenes().length}`,
    transition: T.badge_transition,
    posttest: `${T.badge_posttest} ${S.posttestIndex + 1}/${getPosttestOrder().length}`,
    interview: T.badge_interview,
    debrief: T.badge_debrief
  };
  return map[S.stage] || S.stage;
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

  const pillsHtml = T.consent_pills.map((p, i) =>
    `<span class="pill ${i === 0 ? 'active' : ''}">${esc(p)}</span>`
  ).join("");
  w.append(card(T.consent_flow_title, `
    <div class="pill-row">${pillsHtml}</div>
    <p class="helper-text" style="margin-top:12px">${T.consent_duration}</p>
  `));

  const infoHtml = T.consent_info.map((txt, i) => `
    <div class="consent-item">
      <div class="consent-icon">${i + 1}</div>
      <div>${esc(txt)}</div>
    </div>
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

  w.append(card(T.warmup_title, `<p>${T.warmup_intro}</p>`));

  w.append(contextCard("goal", T.warmup_goal_title, `<div class="answer-box">${T.warmup_goal}</div>`));

  w.append(contextCard("ai", T.warmup_ai_title, `<div class="answer-box">${T.warmup_ai}</div>`));

  const evBullets = T.warmup_ev_bullets.map(b => `<li>${esc(b)}</li>`).join("");
  w.append(contextCard("fact", T.warmup_ev_title, `<div class="answer-box"><ul class="list-tight">${evBullets}</ul></div>`));

  const stepsHtml = T.warmup_steps.map(s => `<li>${esc(s)}</li>`).join("");
  w.append(card(T.warmup_explain_title, `
    <div class="callout">
      <p>${T.warmup_judgment}</p>
      <p>${T.warmup_reason}</p>
      <p>${T.warmup_next_action}</p>
    </div>
    <div style="margin-top:14px">
      <strong>${esc(T.warmup_steps_label)}</strong>
      <ol class="list-tight" style="padding-left:20px;margin-top:8px;">${stepsHtml}</ol>
    </div>
  `));

  const actionsHtml = T.warmup_actions.map(([n, desc]) =>
    `<div class="consent-item"><div class="consent-icon">${n}</div><div>${desc}</div></div>`
  ).join("");
  w.append(card(T.warmup_actions_title, `<div class="consent-grid">${actionsHtml}</div>`));

  const btns = el("div", "button-row");
  btns.append(btn(T.warmup_btn, "primary", () => {
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
  const phaseLabel = phase === "pretest" ? T.phase_pretest : T.phase_posttest;
  const phaseTag = phase === "pretest" ? "pretest" : "posttest";
  hdr.innerHTML = `
    <div class="metric"><div class="label">${esc(T.item_phase)}</div><div class="value"><span class="phase-tag ${phaseTag}">${esc(phaseLabel)}</span></div></div>
    <div class="metric"><div class="label">${esc(T.item_id)}</div><div class="value">${item.id}</div></div>
    <div class="metric"><div class="label">${esc(T.item_category)}</div><div class="value">${esc(T.cat_label[item.category] || item.category)}</div></div>
    <div class="metric"><div class="label">${esc(T.item_progress)}</div><div class="value">${idx + 1} / ${items.length}</div></div>
  `;
  container.append(hdr);

  // AI-free reminder
  const reminderText = phase === "pretest" ? T.reminder_pretest : T.reminder_posttest;
  container.append(createCallout(reminderText, "warn-callout"));

  // Split layout
  const layout = el("div", "split-grid");

  // Left: stimulus
  const left = el("div", "screen-stack");
  left.append(contextCard("goal", T.card_goal, `<div class="answer-box">${esc(item.writing_goal_zh)}</div>`));
  left.append(contextCard("ai", T.card_ai, renderAiOutput(item)));
  left.append(contextCard("fact", T.card_evidence, renderEvidence(item.evidence_card)));
  left.append(contextCard("task", T.card_prompt, `<div class="answer-box">${esc(item.participant_prompt_zh)}</div>`));

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
      <div class="answer-box"><strong>${esc(T.answer_a)}</strong><br>${esc(item.ai_answers.A)}</div>
      <div class="answer-box"><strong>${esc(T.answer_b)}</strong><br>${esc(item.ai_answers.B)}</div>
    </div>
  `;
}

function renderEvidence(ec) {
  const bullets = ec.bullets.map(b => `<li>${esc(b)}</li>`).join("");
  return `<div class="answer-box"><ul class="list-tight">${bullets}</ul></div>`;
}

function createResponseForm(item, phase) {
  const form = el("form", "card field-stack");
  form.innerHTML = `<h2 class="card-title">${esc(T.form_title)}</h2>`;

  const opts = item.response_mode === "comparative_judgment"
    ? S.materials.response_schema.comparative_judgment
    : S.materials.response_schema.single_judgment;

  form.append(createRadioGroup(T.label_judgment, "judgment", opts));
  form.append(createTextArea(T.label_reason, "reason", T.reason_placeholder));
  form.append(createSelect(T.label_next_action, "next_action", S.materials.response_schema.next_action));
  form.append(createRadioGroup(T.label_confidence, "confidence", T.confidence_opts));

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

  const joiner = LANG === "en" ? ", " : "、";
  w.append(card(T.profile_title, `
    <div class="callout">${esc(T.profile_callout)}</div>
    <div class="metric-grid" style="margin-top:14px">
      ${rec.categorySummaries.map(s => `
        <div class="metric">
          <div class="label">${esc(T.cat_label[s.category] || s.category)}</div>
          <div class="value">${s.score} / ${s.maxScore}</div>
          <div class="category-bar"><div class="category-bar-fill ${s.score <= 1 ? 'low' : s.score <= 2 ? 'mid' : 'high'}" style="width:${(s.score / s.maxScore * 100).toFixed(0)}%"></div></div>
        </div>
      `).join("")}
    </div>
    <p style="margin-top:14px"><strong>${esc(T.profile_recommend)}</strong> ${rec.profiles.map(p => `<code>${esc(T.profile_label[p] || p)}</code>`).join(joiner)}</p>
  `));

  const profileCard = el("div", "card field-stack");
  profileCard.innerHTML = `
    <h2 class="card-title">${esc(T.profile_override_title)}</h2>
    <p class="helper-text compact">${esc(T.profile_override_help)}</p>
  `;

  S.materials.profiles.forEach(profile => {
    const label = el("label", "checkbox-row");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "profile";
    input.value = profile;
    input.checked = S.selectedProfiles.includes(profile);
    const span = document.createElement("span");
    span.textContent = T.profile_label[profile] || profile;
    label.append(input, span);
    profileCard.append(label);
  });

  const overrideNote = el("div", "field-stack");
  overrideNote.innerHTML = `
    <label for="override-note">${esc(T.profile_override_note_label)}</label>
    <textarea id="override-note" placeholder="${escAttr(T.profile_override_note_placeholder)}"></textarea>
  `;
  profileCard.append(overrideNote);

  const actions = el("div", "button-row");
  actions.append(btn(T.profile_btn, "primary", () => {
    const checked = [...profileCard.querySelectorAll('input[name="profile"]:checked')].map(n => n.value);
    if (checked.length !== 2) { alert(T.profile_alert); return; }
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
  actions.append(btn(T.profile_btn_reset, "ghost", () => { resetStudy(); render(); }));
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

  w.append(card(T.scene_title, `
    <div class="pill-row">
      <span class="pill active">${esc(scene.scene_id)}</span>
      <span class="pill">${esc(scene.role)}</span>
      <span class="phase-tag intervention">${esc(T.badge_scene)} ${S.sceneIndex + 1}/${scenes.length}</span>
    </div>
    <p class="subtitle compact" style="margin-top:10px">${esc(filled.learningObjective || "")}</p>
  `));

  if (filled.sourceItem) {
    w.append(card(T.scene_recap_title, `<p class="helper-text compact">${esc(buildSceneRecapIntro(filled.failedItemId))}</p>`));
    w.append(contextCard("goal", T.card_goal, `<div class="answer-box">${esc(filled.sourceItem.writing_goal_zh)}</div>`));
    w.append(contextCard("ai", T.card_ai, renderAiOutput(filled.sourceItem)));
    w.append(contextCard("fact", T.card_evidence, renderEvidence(filled.sourceItem.evidence_card)));
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

  // Operator real-time observation note
  const obsLabel = el("p", "prompt-label compact");
  obsLabel.style.marginTop = "8px";
  obsLabel.textContent = T.scene_obs_label;
  sceneCard.append(obsLabel);
  const obsTA = document.createElement("textarea");
  obsTA.id = "obs-note";
  obsTA.placeholder = T.scene_obs_placeholder;
  obsTA.style.minHeight = "60px";
  sceneCard.append(obsTA);

  const actions = el("div", "button-row");
  actions.append(btn(T.scene_btn, "primary", () => {
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

  const questions = T.interview_questions;

  w.append(card(T.interview_title, `
    <span class="phase-tag interview">${esc(T.interview_tag)}</span>
    <p style="margin-top:10px">${esc(T.interview_intro)}</p>
  `));

  const formCard = el("div", "card field-stack");
  questions.forEach((q, i) => {
    const qBlock = el("div", "interview-question");
    qBlock.innerHTML = `<div class="q-number">${esc(T.interview_q_prefix)} ${i + 1}</div><p style="margin:6px 0 10px;font-weight:600">${esc(q)}</p>`;
    const ta = document.createElement("textarea");
    ta.name = `interview_q${i}`;
    ta.placeholder = T.interview_placeholder;
    ta.style.minHeight = "70px";
    ta.value = S.interviewResponses[`q${i}`] || "";
    qBlock.append(ta);
    formCard.append(qBlock);
  });

  const actions = el("div", "button-row");
  actions.append(btn(T.interview_btn, "primary", () => {
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
  w.append(card(T.debrief_title, `<p>${T.debrief_msg}</p>`));

  // Summary stats
  const totalTime = S.sessionStartedAt ? Math.round((Date.now() - S.sessionStartedAt) / 60000) : 0;
  const joiner2 = LANG === "en" ? ", " : "、";
  w.append(card(T.summary_title, `
    <div class="metric-grid">
      <div class="metric"><div class="label">${esc(T.summary_participant)}</div><div class="value">${esc(S.participantId)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_time)}</div><div class="value">${totalTime} ${esc(T.summary_min)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_pretest)}</div><div class="value">${S.pretestResponses.length} ${esc(T.summary_items)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_scenes)}</div><div class="value">${S.sceneResponses.length} ${esc(T.summary_scenes_unit)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_posttest)}</div><div class="value">${S.posttestResponses.length} ${esc(T.summary_items)}</div></div>
      <div class="metric"><div class="label">${esc(T.summary_profiles)}</div><div class="value">${S.selectedProfiles.map(p => T.profile_label[p] || p).join(joiner2)}</div></div>
    </div>
  `));

  // Interaction pattern annotation
  const codingCard = el("div", "card field-stack");
  codingCard.innerHTML = `<h2 class="card-title">${esc(T.coding_title)}</h2>
    <p class="helper-text compact">${esc(T.coding_help)}</p>`;
  const patterns = S.materials.interaction_pattern_codebook.map(e => e.code);
  codingCard.append(createSelect(T.coding_primary, "primary_pattern", patterns));
  codingCard.append(createSelect(T.coding_secondary, "secondary_pattern", patterns));
  codingCard.append(createTextArea(T.coding_evidence, "pattern_note", T.coding_evidence_placeholder));
  w.append(codingCard);

  // Export buttons
  const actions = el("div", "button-row");
  actions.append(btn(T.btn_download, "primary", () => {
    syncCoding();
    downloadJson(buildExport());
  }));
  actions.append(btn(T.btn_copy, "secondary", async () => {
    syncCoding();
    await navigator.clipboard.writeText(JSON.stringify(buildExport(), null, 2));
    alert(T.copy_alert);
  }));
  actions.append(btn(T.btn_new, "ghost", () => { resetStudy(); render(); }));
  w.append(actions);

  // Preview
  const preview = el("div", "card");
  preview.innerHTML = `<h2 class="card-title">${esc(T.preview_title)}</h2><div class="answer-box" style="max-height:400px;overflow:auto;font-size:0.85rem">${esc(JSON.stringify(buildExport(), null, 2))}</div>`;
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
  const defaultGap = LANG === "en" ? "The answer goes beyond what the facts package or source supports." : "答案超出了事实情况或来源所能支持的范围";
  const gap = sourceItem?.gold_label.reason_anchor || defaultGap;
  const lines = scene.script_lines.map(l =>
    l.replace(/\{failed_item_id\}/g, sourceResp?.item_id || "PRE_UNKNOWN")
     .replace(/\{evidence_gap\}/g, gap)
  );
  return {
    targetedProfile,
    failedItemId: sourceResp?.item_id || "PRE_UNKNOWN",
    learningObjective: scene.learning_objective_zh,
    sourceItem,
    evidenceGap: gap,
    lines,
    task: scene.learner_task_zh,
    taskHelp: buildSceneTaskHelp(scene.learner_task_zh, sourceResp?.item_id || "PRE_UNKNOWN")
  };
}

function buildSceneRecapIntro(itemId) {
  if (LANG === "en") {
    return `This scene is based on your earlier pretest item ${itemId}. Review the original task, AI output, and facts package before answering.`;
  }
  return `本场景基于你之前的前测题 ${itemId}。请先查看原始题干、AI 输出和事实情况，再完成下面的学习任务。`;
}

function buildSceneTaskHelp(task, itemId) {
  const mentionsOriginal = /原句|这句话|这个声明|原始句子|original sentence|this phrase|this claim/i.test(task || "");
  if (LANG === "en") {
    if (mentionsOriginal) {
      return `This task refers to pretest item ${itemId}. “The original sentence” or “this claim” means the AI output shown in the recap above.`;
    }
    return `Use the recap above for pretest item ${itemId}. Base your answer on the displayed AI output and facts package rather than memory alone.`;
  }
  if (mentionsOriginal) {
    return `说明：本任务对应前测题 ${itemId}。如果题目中提到“原句”“这句话”或“这个声明”，都指上方回顾中展示的 AI 输出。`;
  }
  return `说明：本任务对应前测题 ${itemId}。请根据上方回顾中的 AI 输出和事实情况作答，不要只凭记忆作答。`;
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

function card(title, html, cls = "") {
  const c = el("div", cls ? `card ${cls}` : "card");
  c.innerHTML = `${title ? `<h2 class="card-title">${title}</h2>` : ""}${html}`;
  return c;
}

function contextCard(kind, title, html) {
  return card(title, html, `context-card context-${kind}`);
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
  ph.value = ""; ph.textContent = T.select_placeholder; ph.selected = true; ph.disabled = true;
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
        <strong>${esc(T.error_title)}</strong>
        <p class="compact">${esc(S.errors || T.error_unknown)}</p>
        <p class="compact">${T.error_help}</p>
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
