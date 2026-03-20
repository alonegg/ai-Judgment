# Item Review List

用途：给研究者直接审题用。这里直接展示当前版本中参与者实际看到的核心题面：
- 题干
- AI 输出或 A/B 选项原文
- 参与者可选项
- 这道题在矩阵中的设计考量
- 预期正确方向

本版采用 `4 categories × 4 domains = 16 items` 的跨域矩阵，覆盖：`调研报告 / 金融分析 / 数据处理 / 历史人文`。

## 全局作答选项

### 单答案题 Judgment
- `Accept`
- `Revise`
- `Reject`

### 比较题 Judgment
- `Prefer A`
- `Prefer B`

### 下一步动作
- `Verify or inspect the original source`
- `Ask AI to regenerate with evidence`
- `Revise the wording`
- `Flag as unusable`
- `Accept with minimal edits`

## PRETEST

### PRE_A1
- Category: `hallucinated-citation`
- Domain: `Research Report`
- 题干：我正在写一份关于青年求职者使用 AI 工具情况的调研报告，我输入的 prompt 是：「半结构化访谈可以帮助识别青年求职者在使用 AI 简历工具时的主要顾虑。」
- AI 输出：你可以引用：Lin, Y., Romero, J., & Singh, P. (2023). 青年求职者使用 AI 简历工具的全国访谈研究. 中国数字社会研究, 12(4), 55-73.
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - A 类 `anchor item`
  - 典型 fabricated / mismatched citation
  - 看参与者能否识别“引用本身不存在或与相近来源不匹配”
- 预期正确方向：`Reject`

### PRE_A2
- Category: `hallucinated-citation`
- Domain: `History / Humanities`
- 题干：我在写一段关于地方志材料使用的历史综述，我输入的 prompt 是：「地方志中的商税记录可以帮助研究晚清区域商业活动的变化。」
- AI 输出：可以使用这条来源：Wang, H. & Keller, M. (2024). 晚清地方志中的商税记录. 历史文献研究, 18(2), 88-109.
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - A 类 `boundary item`
  - citation 主题大致相关，但 venue / issue / page metadata 不准确
  - 看参与者是否会选择 `Revise + verify`，而不是一律 `Reject`
- 预期正确方向：`Revise`

### PRE_B1
- Category: `source-verification`
- Domain: `Financial Analysis`
- 题干：我在写一段公司财务简评，我输入的 prompt 是：「该公司在采用 AI 客服后提升了盈利能力，同时没有影响客户留存。」
- AI 输出：已有材料表明，该公司在采用 AI 客服后提升了盈利能力，同时没有影响客户留存。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - B 类 `anchor item`
  - 来源只支持有限发现，AI 却写成直接强结论
  - 看参与者是否检查“claim 和来源支持范围”是否一致
- 预期正确方向：`Revise`

### PRE_B2
- Category: `source-verification`
- Domain: `Data Processing`
- 题干：我在写一段数据处理方法说明，我输入的 prompt 是：「在合并多来源表格前，应先统一日期格式并检查重复记录。」
- AI 输出：在合并多来源表格前，应先统一日期格式并检查重复记录，这是数据清洗指南中明确提出的基本步骤。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - B 类 `calibrated-acceptance item`
  - AI 表述与给定方法指南一致
  - 避免量表退化成“默认不信 AI 就拿高分”
- 预期正确方向：`Accept`

### PRE_C1
- Category: `trust-calibration`
- Domain: `History / Humanities`
- 题干：我在写一段关于清末报刊传播的历史综述，我输入的 prompt 是：「请帮我概括清末报刊传播与城市公共讨论之间关系的研究。」
- 选项 A：研究已经证实，清末报刊的扩张稳定地推动了全国范围内公共讨论的形成。
- 选项 B：一些区域性研究表明，报刊传播可能扩大了特定城市中的公共讨论空间，但不同地区和时期之间仍存在明显差异。
- 参与者可选项：`Prefer A / Prefer B`
- 这题的考量：
  - C 类 `anchor comparison item`
  - 比较“有边界的表述”和“超出证据范围的概括”
  - 看参与者是否优先选择更 evidence-aligned 的答案
- 预期正确方向：`Prefer B`

### PRE_C2
- Category: `trust-calibration`
- Domain: `Financial Analysis`
- 题干：我在写一段公司业绩点评，我输入的 prompt 是：「请帮我概括这家公司最新财报对利润率的含义。」
- 选项 A：财报显示该公司本季度毛利率承压，管理层也提示短期内仍需关注成本控制。
- 选项 B：这份财报可能反映出一些值得关注的变化，但仍需要更多观察。
- 参与者可选项：`Prefer A / Prefer B`
- 这题的考量：
  - C 类 `boundary comparison item`
  - 比较“具体且与事实一致”的表述和“模糊但看似谨慎”的表述
  - 避免参与者把“更保守”误当成“更正确”
- 预期正确方向：`Prefer A`

### PRE_D1
- Category: `scope-generalization`
- Domain: `Research Report`
- 题干：我在写一段用户调研总结，我输入的 prompt 是：「请帮我总结智能投顾新手用户最常见的顾虑。」
- AI 输出：调研一致表明，所有普通投资者在使用智能投顾时最担心的是算法不透明。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - D 类 `anchor item`
  - 从一个城市中某类用户的访谈发现，泛化到全部普通投资者
  - 看参与者能否抓住样本与结论范围不匹配
- 预期正确方向：`Revise`

### PRE_D2
- Category: `scope-generalization`
- Domain: `Data Processing`
- 题干：我在总结一项城市交通数据清洗实验的效果，我输入的 prompt 是：「请帮我总结这套清洗规则的效果。」
- AI 输出：这套清洗规则已被证明能在全国城市交通数据中稳定识别异常 GPS 记录。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - D 类 `boundary item`
  - 从单城市、单月 GPS 数据试点外推到全国交通系统
  - 纯化为 scope-only case，减少和其他错误类型混淆
- 预期正确方向：`Revise`

## POSTTEST

### POST_A1
- Category: `hallucinated-citation`
- Domain: `Financial Analysis`
- 题干：我在写一段行业分析，我输入的 prompt 是：「独立研究报告指出，中型零售银行正在用生成式 AI 压缩客服成本。」
- AI 输出：你可以引用：Garcia, L., Moore, T., & Zhou, X. (2024). 生成式 AI 在中型零售银行中的客服降本效果. 应用金融战略期刊, 7(3), 41-59.
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - A 类 `anchor item`
  - finance 语境中的 fabricated citation
  - 检查参与者是否能跨领域识别不存在的完整引用
- 预期正确方向：`Reject`

### POST_A2
- Category: `hallucinated-citation`
- Domain: `Data Processing`
- 题干：我在写一段数据工程实践总结，我输入的 prompt 是：「分层抽样后的人工复核可以帮助发现自动标注中的系统性偏差。」
- AI 输出：可以引用：Ibrahim, D. & Chen, P. (2024). 自动标注语料的分层抽样复核. 数据治理研究, 6(1), 13-29.
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - A 类 `boundary item`
  - data-processing 语境中的 citation metadata mismatch
  - 看参与者是否保留“可修复引用”与“彻底假引文”的区分
- 预期正确方向：`Revise`

### POST_B1
- Category: `source-verification`
- Domain: `Research Report`
- 题干：我在写一段产品调研结论，我输入的 prompt 是：「访谈可以帮助团队更快识别高频痛点，但正式决策前仍需做进一步验证。」
- AI 输出：现有调研表明，访谈可以帮助团队更快识别高频痛点，但在形成正式决策前仍需进一步验证。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - B 类 `calibrated-acceptance item`
  - AI 正确保留了来源支持与未支持部分的边界
  - 再次测量 calibrated acceptance，而不是 blanket distrust
- 预期正确方向：`Accept`

### POST_B2
- Category: `source-verification`
- Domain: `History / Humanities`
- 题干：我在写一段历史方法综述，我输入的 prompt 是：「一项史学研究证明，家族谱牒记录能够直接还原普通人的日常经济行为。」
- AI 输出：一项史学研究证明，家族谱牒记录能够直接还原普通人的日常经济行为。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - B 类 `anchor item`
  - 把方法性、线索性论文误写成直接证明性结论
  - 看参与者能否识别“source type != claim strength”
- 预期正确方向：`Revise`

### POST_C1
- Category: `trust-calibration`
- Domain: `Data Processing`
- 题干：我在写一段数据质量管理综述，我输入的 prompt 是：「请帮我概括可视化仪表板在数据异常检测中的作用。」
- 选项 A：可视化仪表板可以帮助分析人员更快发现异常趋势，但在定位原因前仍需回看原始记录。
- 选项 B：可视化仪表板能够可靠地发现并解释所有数据质量问题，因为它提供了完整的异常视图。
- 参与者可选项：`Prefer A / Prefer B`
- 这题的考量：
  - C 类 `anchor comparison item`
  - 比较“受事实支持的局部总结”和“无依据的全局判断”
  - 测量 evidence alignment，而不是单纯 cautiousness preference
- 预期正确方向：`Prefer A`

### POST_C2
- Category: `trust-calibration`
- Domain: `Research Report`
- 题干：我在写一段市场调研方法综述，我输入的 prompt 是：「请帮我概括 AI 摘要在整理访谈材料时的作用。」
- 选项 A：AI 摘要确保研究者得到准确且完整的访谈结论。
- 选项 B：AI 摘要可能帮助研究者更快整理访谈材料，但在正式引用结论前仍需回看原始访谈记录。
- 参与者可选项：`Prefer A / Prefer B`
- 这题的考量：
  - C 类 `boundary comparison item`
  - 比较“保留价值但提示仍需核查”的表述与“过度肯定”的表述
  - 看参与者是否能接受带边界的可用回答
- 预期正确方向：`Prefer B`

### POST_D1
- Category: `scope-generalization`
- Domain: `History / Humanities`
- 题干：我在写一段历史人文综述，我输入的 prompt 是：「请帮我总结地方档案在研究区域税收实践中的发现。」
- AI 输出：地方档案研究表明，晚清全国各地的税收执行方式都高度依赖地方协商。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - D 类 `anchor item`
  - 从江南两个县的地方档案发现，泛化到晚清全国税收模式
  - 纯化为历史人文语境中的 scope-only case
- 预期正确方向：`Revise`

### POST_D2
- Category: `scope-generalization`
- Domain: `Financial Analysis`
- 题干：我在写一段行业评论，我输入的 prompt 是：「请帮我总结生成式 AI 对零售行业利润率的影响。」
- AI 输出：生成式 AI 已被证明能在所有零售细分行业中持续提升利润率。
- 参与者可选项：`Accept / Revise / Reject`
- 这题的考量：
  - D 类 `boundary item`
  - 从服装零售试点的短期结果，扩大到所有零售细分行业的持续结论
  - 看参与者是否会对“行业外推 + 时间外推”保持边界意识
- 预期正确方向：`Revise`

## 快速看法

- 当前这版已经不再是“全是教育写作题”，而是一个跨域 judgment matrix。
- 最值得重点盯的 boundary / calibration 题仍是：`PRE_A2`、`PRE_B2`、`PRE_C2`、`POST_B1`。
- 如果参与者在这些题上全部落到“默认 Reject / 默认选更保守”，说明量表仍有 blanket distrust 风险。
