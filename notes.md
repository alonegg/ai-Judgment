# Notes: AI Judgment Micro-Intervention for ICAIE

## Source 1: ICAIE 2026 CFP
- URL: https://www.icaie.org/cfp.html
- Key points:
  - 会议主题覆盖 `AI literacy`、`interactive education`、`personalized learning`、`educational technologies` 等方向。
  - 选题需要同时体现 AI 方法和教育场景，不适合纯技术对比或纯态度调查。

## Source 2: ICAIE 2026 Submission
- URL: https://www.icaie.org/sub.html
- Key points:
  - `Full Paper` 的 `Final Call` 为 `2026-03-30`。
  - 时间窗口很短，选题必须偏最小闭环，而非大型系统论文。

## Source 3: From G-Factor to A-Factor: Establishing a Psychometric Framework for AI Literacy
- URL: https://arxiv.org/abs/2503.16517
- Key points:
  - 论文将 AI literacy 作为可测量构念，并拆成 communication effectiveness、creative idea generation、content evaluation、step-by-step collaboration 四个维度。
  - 说明“AI literacy 可以任务化测量”，适合作为本研究诊断层的理论锚点。
  - 也说明 literacy 不该只测态度或自报告。

## Source 4: DeBiasMe: 4A Framework for Enhancing Human Judgment in LLM Collaboration
- URL: https://arxiv.org/abs/2503.14481
- Key points:
  - 提出通过结构化流程减少人类在 LLM 协作中的 judgment bias。
  - 直接启发本项目的 intervention 结构：不是单纯给答案，而是引导分析、质疑、校准与反思。

## Source 5: Incorporating generative AI into a writing-intensive undergraduate course without off-loading learning
- URL: https://link.springer.com/article/10.1007/s10791-025-09563-9
- Key points:
  - 强调教育设计中应避免 off-loading learning。
  - 提出 `understand -> access -> prompt -> corroborate -> incorporate` 的教学逻辑。
  - 支持本项目把 intervention 设计为 scaffolded and bounded use，而不是自由聊天。

## Source 6: OpenMAIC Repo / Paper Context
- URL: https://github.com/THU-MAIC/OpenMAIC
- Related paper: https://jcst.ict.ac.cn/en/article/doi/10.1007/s11390-025-6000-0
- Key points:
  - 值得借鉴的是 `outline -> scene` 两阶段生成和角色化教学编排。
  - 不值得在本轮直接照搬的是完整大系统实现和复杂 UI。

## Source 7: Local ICAIE 2025 Sample Set
- File: `/Users/alone/Desktop/论文/ICAIE/ICAIE_2025_Papers.json`
- Key points:
  - 去年题目中 `ChatGPT attitude`、`general AI in education`、`teacher-AI broad discussion` 明显偏多。
  - 更有差异化空间的是 task-based intervention、teacher support、bounded AI use、judgment/calibration。

## Source 8: How AI Impacts Skill Formation
- URL: https://arxiv.org/abs/2601.20245
- Local PDF: `/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/references/2601.20245_How_AI_Impacts_Skill_Formation.pdf`
- Key points:
  - 论文通过 randomized experiment 研究 AI assistance 对新技能习得的影响，发现 AI 使用会削弱 conceptual understanding、code reading 与 debugging，且平均效率收益并不显著。
  - 他们没有只看最终任务完成情况，而是单独设计了不允许使用 AI 的 comprehension check 来测 skill formation。
  - 论文把 AI interaction 分成 6 种 pattern，其中高分 pattern 不是“完全不用 AI”，而是带有 cognitive engagement 的使用方式，如 `Conceptual Inquiry`、`Hybrid Code-Explanation`、`Generation-Then-Comprehension`。
  - 对本项目最重要的启发不是“做 coding”，而是：要把 AI use 的 interaction process 也当成结果的一部分来分析，而不只看 pre/post 得分。
  - 本地已完成下载并验真：`file` 识别为 PDF 1.7，`pdfinfo` 显示标题、作者和 `31` 页。

## Synthesized Findings

### 1. 推荐的 gap
- 现有 AIED/GenAI 教育研究中，很多工作还停留在”态度””接受度””是否使用 AI”。
- 较少工作把 `AI judgment` 作为一个可诊断、可干预、可测量的能力。
- 更少工作关注 AI 输出的 scope generalization 问题，即 AI 将有限研究结论或已验证信息不当放大、过度泛化的现象。
- 更少工作做 `personalized micro-intervention`，尤其是把 profile 与 intervention scene 显式绑定。

### 2. 推荐的研究主张
- 本研究不主张“提升通用 AI literacy”。
- 本研究主张：`personalized micro-intervention` 能在短时任务中改善学生对 AI 输出的判断、核验和信心校准。
- 这是 `pilot feasibility` 主张，不是大样本因果证明。

### 3. 推荐的任务场景
- 首选：`bounded knowledge tasks/source verification`
  - 仍然容易构造并行题项。
  - 更容易检验参与者学到的是跨域 `judgment rule`，而不是单一语境 cue。
  - 当前冻结版本覆盖 `调研报告 / 金融分析 / 数据处理 / 历史人文` 四类内容领域。
- 备选：`single-domain academic writing`
  - 题项更容易设计，但更容易被单一语境 cue learning 污染。
- 不推荐作为首发：`programming assistance judgment`
  - 工程门槛和题目复杂度更高。

### 4. 推荐的 intervention 结构
- `diagnostic task`
- `profile assignment`
- `micro-scene 1: concept`
- `micro-scene 2: contrastive example`
- `micro-scene 3: skeptic challenge`
- `micro-scene 4: reflection and rule extraction`

### 5. 推荐的测量指标
（跨四个 categories：hallucination detection、source verification、trust calibration、scope generalization detection）
- judgment accuracy（分别在四个 categories 上计算）
- explanation quality
- confidence calibration
- time on task
- perceived cognitive load
- perceived usefulness

### 6. Feasibility judgement
- `4-5` 名学生足够支撑 pilot。
- 最稳妥的设计是单次实验内完成 `pretest -> intervention -> posttest`。
- 若工程时间不足，可采用 Wizard-of-Oz 生成个性化 intervention 内容，先保研究闭环。

### 7. Methodological inspiration from `How AI Impacts Skill Formation`
- 我们也应该像这篇 paper 一样，把”技能形成”拆成多个可评分子能力，而不是只看一个总分。
- 我们新增第四类 judgment 维度（scope generalization detection）后，四类 judgment 分解（hallucinated citation / source verification / trust calibration / scope generalization）更加完整，可以类比其 conceptual / code reading / debugging / 深层思维能力的分解。
- 我们应该坚持在 `posttest` 阶段不让参与者再求助 AI，以保证测到的是形成后的 judgment ability，而不是即时 AI-assisted performance。
- 我们后续可以补一层 interaction-pattern analysis：
  - 例如 `rule-seeking`
  - `evidence-checking`
  - `answer-comparing`
  - `authority-following`
  - `surface-editing`
- 这会让我们的论文不只是在说”分数变了”，而是在说”什么样的 AI interaction 更保留 judgment formation”。
