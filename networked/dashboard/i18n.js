(function () {
  const LANG = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";

  const T = LANG === "en" ? {
    doc_title: "Operator Dashboard — AI Judgment Pilot",
    header_title: "Operator Dashboard",
    header_subtitle: "AI Judgment Micro-Intervention Pilot",
    conn_connected: "● Connected",
    conn_disconnected: "● Offline",
    participants_suffix: "participants",
    btn_export_all: "Export all",
    empty_title: "No participants connected",
    empty_hint: 'Participants will appear here after opening <code>http://&lt;your-ip&gt;:3000/</code>',
    panel_default: "P01 — Operator Actions",
    event_log_title: "Live Event Log",
    cat_label: {
      "hallucinated-citation": "Hallucinated Citation",
      "source-verification": "Source Verification",
      "trust-calibration": "Trust Calibration",
      "scope-generalization": "Scope Generalization"
    },
    profile_label: {
      "hallucination-weak": "Hallucination-weak",
      "verification-weak": "Verification-weak",
      "trust-calibration-weak": "Trust-calibration-weak",
      "scope-generalization-weak": "Scope-generalization-weak"
    },
    stage_label: {
      consent: "Consent",
      warmup: "Warm-up",
      pretest: "Pretest",
      profile: "Profile",
      profile_waiting: "Waiting approval",
      scenes: "Intervention",
      transition: "Transition",
      posttest: "Posttest",
      interview: "Interview",
      debrief: "Completed"
    },
    log_connected: "connected",
    log_disconnected: "disconnected",
    log_stale: "heartbeat timeout",
    log_enter: "entered",
    log_submit_item: "submitted",
    log_confidence: "confidence",
    log_submit_scene: "submitted scene",
    log_profile_waiting: "pretest complete → waiting for profile approval",
    log_export_done: "export complete",
    log_export_all_done: "all exports complete",
    log_profile_approved: "profile approved",
    log_interview_done: "interview complete → debrief",
    log_pattern_saved: "pattern saved",
    log_nudge_sent: "nudge sent",
    log_observation_saved: "observation saved",
    section_scores: "Category scores",
    system_recommend: "System recommendation:",
    section_select_profiles: "Select intervention directions (choose 2)",
    override_note_label: "Override note (explain if adjusted)",
    override_note_placeholder: "Example: the explanation text suggests the student is weaker in source verification than the score indicates",
    btn_approve: "Approve",
    btn_use_recommend: "Use recommendation",
    alert_select_two: "Please select exactly two intervention directions",
    section_interview: "Interview notes",
    interview_help: "Please record the participant's spoken answers here.",
    interview_questions: [
      "Which scene was most helpful? Why?",
      "What is the judgment rule you would use most often now?",
      "What type of error are you still most likely to make?",
      "If this system were embedded in a real course, at which step would you use it?",
      "Was there any part of the process that felt confusing or uncertain?",
      "If you could remove one step, which would it be? Why?"
    ],
    interview_q_prefix: "Q",
    interview_placeholder: "Record key points from the participant...",
    btn_save_interview: "Save interview and continue",
    section_coding: "Interaction pattern coding",
    coding_primary: "Primary pattern",
    coding_secondary: "Secondary pattern (optional)",
    coding_note_label: "Coding note",
    coding_note_placeholder: "Brief note on coding rationale",
    btn_save_pattern: "Save coding",
    section_export: "Data export",
    btn_export_one: "Export this participant",
    section_quick_actions: "Quick actions",
    nudges: [
      ["Speed reminder", "You can make a judgment based on the information already on screen."],
      ["Check once more", "Once finished, you can review your answer one more time."],
      ["Take a short break", "You may take a one- or two-minute break."]
    ],
    custom_nudge_placeholder: "Custom nudge message...",
    btn_send: "Send",
    section_observation: "Observation notes",
    observation_label: "Current scene observation",
    observation_placeholder: "Record participant behavior in the current scene...",
    btn_save_observation: "Save observation",
    section_responses: "Response history",
    resp_judgment: "Judgment",
    resp_confidence: "Confidence",
    select_placeholder: "— Select —",
    dashboard_started: "Dashboard started"
  } : {
    doc_title: "操作台 — AI 判断力微干预实验",
    header_title: "操作台",
    header_subtitle: "AI 判断力微干预实验",
    conn_connected: "● 已连接",
    conn_disconnected: "● 未连接",
    participants_suffix: "参与者",
    btn_export_all: "导出全部",
    empty_title: "暂无参与者连接",
    empty_hint: '参与者访问 <code>http://&lt;your-ip&gt;:3000/</code> 后将自动出现',
    panel_default: "P01 — 操作面板",
    event_log_title: "实时事件流",
    cat_label: {
      "hallucinated-citation": "虚构引用",
      "source-verification": "来源核查",
      "trust-calibration": "可信度校准",
      "scope-generalization": "范围泛化"
    },
    profile_label: {
      "hallucination-weak": "虚构引用薄弱",
      "verification-weak": "来源核查薄弱",
      "trust-calibration-weak": "可信度校准薄弱",
      "scope-generalization-weak": "范围泛化薄弱"
    },
    stage_label: {
      consent: "同意书",
      warmup: "热身",
      pretest: "前测",
      profile: "诊断",
      profile_waiting: "等待确认",
      scenes: "干预场景",
      transition: "过渡",
      posttest: "后测",
      interview: "访谈",
      debrief: "已完成"
    },
    log_connected: "已连接",
    log_disconnected: "已断线",
    log_stale: "⚠ 心跳超时",
    log_enter: "进入",
    log_submit_item: "提交",
    log_confidence: "信心",
    log_submit_scene: "提交场景回应",
    log_profile_waiting: "前测完成，等待干预方向确认",
    log_export_done: "导出完成",
    log_export_all_done: "全部导出完成",
    log_profile_approved: "干预方向已确认",
    log_interview_done: "访谈完成，进入结束页",
    log_pattern_saved: "标注",
    log_nudge_sent: "发送提醒",
    log_observation_saved: "观察记录",
    section_scores: "类别得分",
    system_recommend: "系统推荐：",
    section_select_profiles: "选择干预方向（勾选 2 个）",
    override_note_label: "覆盖备注（如有调整请说明原因）",
    override_note_placeholder: "如：解释文本显示该学生在来源核查上比分数反映的更弱",
    btn_approve: "✓ 批准",
    btn_use_recommend: "← 使用推荐",
    alert_select_two: "请选择恰好两个干预方向",
    section_interview: "访谈记录",
    interview_help: "请在此记录参与者的口头回答。",
    interview_questions: [
      "哪个场景最有帮助？为什么？",
      "你现在最常用的判断规则是什么？",
      "哪种错误你仍然最容易犯？",
      "如果把这个系统嵌入真实课程，你会在哪一步使用它？",
      "在刚才的过程中，有没有哪个环节让你感到困惑或不确定？",
      "如果让你删掉一个环节，你会删哪个？为什么？"
    ],
    interview_q_prefix: "问题",
    interview_placeholder: "记录参与者的回答要点...",
    btn_save_interview: "✓ 保存访谈并继续",
    section_coding: "交互模式标注",
    coding_primary: "主要模式",
    coding_secondary: "次要模式（可选）",
    coding_note_label: "编码依据",
    coding_note_placeholder: "简要记录编码依据",
    btn_save_pattern: "保存标注",
    section_export: "数据导出",
    btn_export_one: "导出此参与者",
    section_quick_actions: "快捷操作",
    nudges: [
      ["⏱ 提醒加快", "可以基于现有信息做出判断"],
      ["📝 检查一遍", "做完可以再检查一遍答案"],
      ["☕ 可以休息", "可以休息一两分钟"]
    ],
    custom_nudge_placeholder: "自定义提醒内容...",
    btn_send: "发送",
    section_observation: "观察笔记",
    observation_label: "当前场景观察",
    observation_placeholder: "记录参与者在当前场景中的行为...",
    btn_save_observation: "保存观察",
    section_responses: "回答记录",
    resp_judgment: "判断",
    resp_confidence: "信心",
    select_placeholder: "— 请选择 —",
    dashboard_started: "操作台已启动"
  };

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function setHtml(id, html) {
    const node = document.getElementById(id);
    if (node) node.innerHTML = html;
  }

  function applyHeadText() {
    document.documentElement.lang = LANG === "en" ? "en" : "zh-CN";
    document.title = T.doc_title;
  }

  function applyStaticText() {
    setText("dashboard-title", T.header_title);
    setText("dashboard-subtitle", T.header_subtitle);
    setText("conn-status", T.conn_disconnected);
    setText("session-count", `0 ${T.participants_suffix}`);
    setText("btn-export-all", T.btn_export_all);
    setText("empty-title", T.empty_title);
    setHtml("empty-hint", T.empty_hint);
    setText("panel-title", T.panel_default);
    setText("event-log-title", T.event_log_title);
  }

  applyHeadText();

  window.DashboardI18n = { LANG, T, applyHeadText, applyStaticText };
})();
