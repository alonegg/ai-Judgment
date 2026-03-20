# Item Bank Full v1: Cross-Domain Controlled Study Materials

## Usage Note
本文件中的题目全部用于 **实验材料**，不是论文参考文献库。

说明：
- 本版采用 `4 categories × 4 domains = 16 items` 的跨域矩阵。
- 四个内容领域分别是：`调研报告`、`金融分析`、`数据处理`、`历史人文`。
- 所有 `事实情况` 都是为控制实验变量而整理的 **bounded study materials**。
- A 类题目中部分 citation 是 **故意构造的错误样例**。
- B/C/D 类题目中的材料也都是为实验而简化整理的摘要式事实包。

## Global Response Format
每道题要求参与者完成四步：
1. `judgment`
   - A/B/D 类：`Accept / Revise / Reject`
   - C 类：`Prefer A / Prefer B`
2. `reason`: 用 1-3 句话说明依据
3. `next_action`: 从固定选项中选择下一步
4. `confidence`: `1-5`

固定 `next_action` 选项：
- verify or inspect the source
- ask AI to regenerate with supporting evidence
- weaken the claim wording
- flag and do not use this output
- accept with minor edits

## PRETEST

### PRE_A1
- Category: `hallucinated-citation`
- Domain: `Research Report`
- 题干：我在整理一份关于青年求职服务的调研背景，想补一句「有研究发现，使用生成式工具改写简历时，求职者最担心的是表达变得模板化」。我输入给 AI 的 prompt 是：『根据这句话，给我一条可以放在句末的引用。』
- AI 输出：可以在句末补这条：Lin, Y., Romero, J., & Singh, P. (2023). 青年求职者使用 AI 简历工具的访谈研究. 中国数字社会研究, 12(4), 55-73.
- 事实情况：
  - 数据库检索：未找到《中国数字社会研究》第12卷第4期第55-73页的记录。
  - 数据库检索：该条目未检索到 DOI 或稳定链接。
  - 相近检索结果：Lin, Y. & Singh, P. (2022). 就业服务中心中的数字求职辅助访谈记录. working paper。
  - 这篇 working paper 讨论的是就业服务机构中的数字求职支持，不是生成式 AI 简历改写工具。
  - 作者有部分重合，但研究对象、题名表述和发表形式都与 AI 给出的引用不一致。
- Prompt shown to participant: 你会如何处理这条 AI 给出的引用？
- Gold label:
  - judgment: 拒绝
  - next_action: 标记为不可用 / 核查或检视原始来源
- Why: 这条引用的关键信息无法核验；相近来源也只是在作者上部分重合，并不支持 AI 给出的题名、发表形式和研究对象。

### PRE_A2
- Category: `hallucinated-citation`
- Domain: `History / Humanities`
- 题干：我在写一段关于地方志材料使用的历史综述，我输入的 prompt 是：「地方志中的商税记录可以帮助研究晚清区域商业活动的变化。」
- AI 输出：可以使用这条来源：Wang, H. & Keller, M. (2024). 晚清地方志中的商税记录. 历史文献研究, 18(2), 88-109.
- 事实情况：
  - 数据库检索：找到了作者为 Wang 和 Keller、题名一致的 2024 年真实来源。
  - 该真实来源的发表形式是 edited volume chapter，而不是《历史文献研究》期刊文章。
  - 真实来源并不对应期刊 volume / issue 信息。
  - 摘要显示：地方志中的商税记录可用于分析晚清特定区域商业活动的变化。
- Prompt shown to participant: 你会接受、修改还是拒绝这条 AI 建议？为什么？
- Gold label:
  - judgment: 修改
  - next_action: 核查或检视原始来源
- Why: 这条来源看起来真实且主题相关，但 AI 给出的发表形式与期刊元数据不准确，不能直接照抄，必须先核对真实 citation。

### PRE_B1
- Category: `source-verification`
- Domain: `Financial Analysis`
- 题干：我在根据一份 Q3 业绩电话会纪要写两句投资者沟通摘要。我输入给 AI 的 prompt 是：『概括 AI 客服上线后的业务影响，语气像 sell-side note。』
- AI 输出：管理层信息显示，AI 客服上线后客服效率改善，利润率回升也说明这项举措已经开始兑现财务效果，短期内客户留存看起来保持稳定。
- 事实情况：
  - 来源标题：《公司 Q3 业绩电话会纪要》
  - 管理层表示，AI 客服工具上线后，本季度客服人力成本和平均响应时间都有所下降。
  - 纪要同时提到本季度经营利润率改善，但也提到了产品结构调整和营销费用收缩。
  - 该材料没有提供客户留存率是否稳定的证据，也没有证明利润率改善主要由 AI 客服带来。
- Prompt shown to participant: 对这句 AI 生成的分析表述，你会怎么处理？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: 材料支持客服效率改善，也支持利润率在同一季度回升，但不支持把利润改善直接归因于 AI 客服，更不支持“客户留存保持稳定”这一补充判断。

### PRE_B2
- Category: `source-verification`
- Domain: `Data Processing`
- 题干：我在写一段数据处理方法说明，我输入的 prompt 是：「在合并多来源表格前，应先统一日期格式并检查重复记录。」
- AI 输出：在合并多来源表格前，应先统一日期格式并检查重复记录，这是数据清洗指南中明确提出的基本步骤。
- 事实情况：
  - 来源标题：《多来源行政表格合并实务指南》
  - 指南明确建议在 merge 前统一日期与时间格式。
  - 指南明确建议在 merge 前检查重复记录和冲突 ID。
  - 该来源是程序性指导文件，不是效果评估研究，但这些步骤确实被直接推荐。
- Prompt shown to participant: 你会如何处理这句 AI 生成的方法建议？
- Gold label:
  - judgment: 接受
  - next_action: 接受并做小幅修改
- Why: 这句话准确概括了指南中的直接建议，没有把程序性指导误写成实证效果。

### PRE_C1
- Category: `trust-calibration`
- Domain: `History / Humanities`
- 题干：我在写一段关于清末报刊传播的历史综述，我输入的 prompt 是：「请帮我概括清末报刊传播与城市公共讨论之间关系的研究。」
- AI 输出：
  - A: 研究已经证实，清末报刊的扩张稳定地推动了全国范围内公共讨论的形成。
  - B: 一些区域性研究表明，报刊传播可能扩大了特定城市中的公共讨论空间，但不同地区和时期之间仍存在明显差异。
- 事实情况：
  - 现有研究主要分析上海、天津等少数城市的报刊与公共讨论。
  - 这些研究表明报刊传播可能扩大了特定城市中的讨论空间。
  - 作者提醒：现有证据不足以推及全国，也不能假定不同地区和时期效果一致。
- Prompt shown to participant: 哪个答案更可信？你会如何继续处理它？
- Gold label:
  - judgment: 选择 B
  - next_action: 核查或检视原始来源 / 弱化论述措辞
- Why: B 保留了区域性证据与边界条件，A 则把有限城市研究写成了全国性、稳定性的定论。

### PRE_C2
- Category: `trust-calibration`
- Domain: `Financial Analysis`
- 题干：我在写一段公司业绩点评，我输入的 prompt 是：「请帮我概括这家公司最新财报对利润率的含义。」
- AI 输出：
  - A: 财报显示该公司本季度毛利率承压，管理层也提示短期内仍需关注成本控制。
  - B: 这份财报可能反映出一些值得关注的变化，但仍需要更多观察。
- 事实情况：
  - Q2 财报显示毛利率由 34% 下降到 29%。
  - 管理层将压力归因于库存调整，并表示下季度仍需继续控制成本。
  - 材料并不支持长期趋势判断，但支持对本季度利润率承压的描述。
- Prompt shown to participant: 哪个答案更可信？原因是什么？
- Gold label:
  - judgment: 选择 A
  - next_action: 接受并做小幅修改 / 核查或检视原始来源
- Why: A 具体且与材料一致，B 虽然更模糊，但遗漏了财报中已经明确支持的关键信息。

### PRE_D1
- Category: `scope-generalization`
- Domain: `Research Report`
- 题干：我在给产品周会准备一条用户洞察摘要。我输入给 AI 的 prompt 是：『根据这组访谈纪要，写一句最值得放在首页的核心发现。』
- AI 输出：受访者普遍把“看不懂模型怎么给建议”当成使用智能投顾的核心阻碍，这也说明普通投资者对这类产品最敏感的问题仍是算法透明度。
- 事实情况：
  - 该研究基于上海两家营业点中 24 名首次使用智能投顾的用户访谈。
  - 不少受访者提到，他们难以理解系统为什么给出某类建议。
  - 作者同时记录到新手用户还会担心风险提示看不懂、产品切换成本高等问题。
  - 作者提醒：样本局限于一个城市中的新手用户，不能直接代表普通投资者整体。
- Prompt shown to participant: 你会保留、修改还是拒绝这句 AI 总结？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: 材料最多支持“这组上海新手用户访谈中，算法透明度是常见顾虑之一”，不支持把它提升为普通投资者整体的核心阻碍。

### PRE_D2
- Category: `scope-generalization`
- Domain: `Data Processing`
- 题干：我在总结一项城市交通数据清洗实验的效果，我输入的 prompt 是：「请帮我总结这套清洗规则的效果。」
- AI 输出：这套清洗规则已被证明能在全国城市交通数据中稳定识别异常 GPS 记录。
- 事实情况：
  - 该试验基于杭州三个城区、一个月的出租车 GPS 数据。
  - 在该数据集上，这套规则提升了异常记录识别效果。
  - 作者提醒：目前没有证据表明这些规则可直接推广到其他城市、季节或传感系统。
- Prompt shown to participant: 你会如何处理这句 AI 总结？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: 原研究支持的是杭州特定数据集上的效果，不支持“全国城市交通数据中稳定有效”这一更大范围的说法。

## POSTTEST

### POST_A1
- Category: `hallucinated-citation`
- Domain: `Financial Analysis`
- 题干：我在写一段行业分析，我输入的 prompt 是：「独立研究报告指出，中型零售银行正在用生成式 AI 压缩客服成本。」
- AI 输出：你可以引用：Garcia, L., Moore, T., & Zhou, X. (2024). 生成式 AI 在中型零售银行中的客服降本效果. 应用金融战略期刊, 7(3), 41-59.
- 事实情况：
  - 数据库检索：未找到《应用金融战略期刊》第7卷第3期第41-59页的记录。
  - 数据库检索：该引用未检索到 DOI。
  - 相关检索结果：Garcia, L. & Zhou, X. (2023). Retail Banking Service Operations 中的 AI 试点. industry webinar brief。
  - 该 brief 讨论的是两家银行中的试点，不是关于中型零售银行整体的正式研究报告。
  - 作者姓名部分重合，但题目、发表形式和研究范围都与 AI 给出的引用不一致。
- Prompt shown to participant: 你会如何处理这条 AI 引用建议？
- Gold label:
  - judgment: 拒绝
  - next_action: 核查或检视原始来源 / 标记为不可用
- Why: 这条引用无法核验，相关检索结果也不支持 AI 所写的期刊、页码和研究范围。

### POST_A2
- Category: `hallucinated-citation`
- Domain: `Data Processing`
- 题干：我在写一段数据工程实践总结，我输入的 prompt 是：「分层抽样后的人工复核可以帮助发现自动标注中的系统性偏差。」
- AI 输出：可以引用：Ibrahim, D. & Chen, P. (2024). 自动标注语料的分层抽样复核. 数据治理研究, 6(1), 13-29.
- 事实情况：
  - 数据库检索：找到了 Ibrahim 与 Chen 于 2024 年发表、题名高度相近的真实来源。
  - 真实来源的发表形式是 workshop proceedings paper，而不是《数据治理研究》期刊文章。
  - 真实来源并不对应 journal volume / issue 信息。
  - 摘要显示：分层人工复核确实帮助发现了自动标注语料中的系统性偏差。
- Prompt shown to participant: 这条 AI 建议可不可以直接用？为什么？
- Gold label:
  - judgment: 修改
  - next_action: 核查或检视原始来源
- Why: 来源主题是相关的，且大概率真实存在，但 AI 提供的是不准确的发表形式与期刊元数据，不能直接照抄。

### POST_B1
- Category: `source-verification`
- Domain: `Research Report`
- 题干：我在写一段产品调研结论，我输入的 prompt 是：「访谈可以帮助团队更快识别高频痛点，但正式决策前仍需做进一步验证。」
- AI 输出：现有调研表明，访谈可以帮助团队更快识别高频痛点，但在形成正式决策前仍需进一步验证。
- 事实情况：
  - 来源标题：《产品发现阶段的早期用户访谈》
  - 研究团队使用访谈更快识别了重复出现的用户痛点。
  - 作者提醒：访谈材料具有探索性，重大决策前仍需更大范围的验证。
  - 该来源没有声称访谈结果本身具有市场总体代表性。
- Prompt shown to participant: 你会保留、修改还是拒绝这句话？
- Gold label:
  - judgment: 接受
  - next_action: 接受并做小幅修改
- Why: AI 句子准确保留了来源支持的 benefit 与 limitation，没有把探索性访谈误写成可直接决策的强证据。

### POST_B2
- Category: `source-verification`
- Domain: `History / Humanities`
- 题干：我在写一段历史方法综述，想用一句话说明谱牒材料的研究价值。我输入给 AI 的 prompt 是：『根据这篇方法论文，写一句可直接放进正文的概括。』
- AI 输出：文章认为，谱牒材料虽然存在偏差，但仍能较可靠地帮助研究者重建普通家庭的日常经济行为。
- 事实情况：
  - 来源标题：《把家族谱牒作为历史线索》
  - 论文认为家族谱牒可为家族策略、婚姻安排和部分经济活动提供线索。
  - 作者反复讨论了谱牒材料的偏差、沉默、阶层偏倚和代表性限制。
  - 论文并没有声称谱牒材料能够较可靠地重建普通家庭完整的日常经济行为。
- Prompt shown to participant: 你会如何处理这句话？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: 原文支持“提供线索”，不支持“较可靠地重建普通家庭的日常经济行为”；AI 把方法线索写成了较强的还原性结论。

### POST_C1
- Category: `trust-calibration`
- Domain: `Data Processing`
- 题干：我在写一段数据质量管理综述，我输入的 prompt 是：「请帮我概括可视化仪表板在数据异常检测中的作用。」
- AI 输出：
  - A: 可视化仪表板可以帮助分析人员更快发现异常趋势，但在定位原因前仍需回看原始记录。
  - B: 可视化仪表板能够可靠地发现并解释所有数据质量问题，因为它提供了完整的异常视图。
- 事实情况：
  - 仪表板帮助分析人员更快注意到异常峰值与趋势。
  - 分析人员仍需要回看原始记录来判断异常原因。
  - 并非所有数据质量问题都能在仪表板上直接显现。
- Prompt shown to participant: 哪个答案更可信？下一步你会怎么做？
- Gold label:
  - judgment: 选择 A
  - next_action: 核查或检视原始来源 / 接受并做小幅修改
- Why: A 保留了仪表板的实际作用与边界，B 则把辅助发现写成了“发现并解释所有问题”的全能结论。

### POST_C2
- Category: `trust-calibration`
- Domain: `Research Report`
- 题干：我在写一段市场调研方法综述。我输入给 AI 的 prompt 是：『根据这篇文章，写一句说明 AI 摘要在处理访谈记录中的用途。』
- AI 输出：
  - A: AI 摘要能明显提高初步整理效率，很多团队会直接据此提炼访谈结论。
  - B: AI 摘要适合用来做初步归纳，但在正式写结论前仍需要回到原始访谈记录核对语境和限制条件。
- 事实情况：
  - 研究团队使用 AI 摘要后，更快完成了访谈笔记的初步整理。
  - 部分 AI 摘要会遗漏限制条件，或混淆不同受访者的表述。
  - 作者建议：在形成正式结论前，仍需回看原始访谈记录并核对语境。
- Prompt shown to participant: 哪个答案更可信？为什么？
- Gold label:
  - judgment: 选择 B
  - next_action: 核查或检视原始来源
- Why: B 保留了 AI 摘要的效率价值，同时没有删除回看原始访谈记录这一关键验证步骤；A 则把一种常见但不稳妥的工作习惯写成了可直接采用的做法。

### POST_D1
- Category: `scope-generalization`
- Domain: `History / Humanities`
- 题干：我在写一段历史人文综述，我输入的 prompt 是：「请帮我总结地方档案在研究区域税收实践中的发现。」
- AI 输出：地方档案研究表明，晚清全国各地的税收执行方式都高度依赖地方协商。
- 事实情况：
  - 该研究考察的是江南地区两个县的地方档案。
  - 作者发现，在这两个案例中，税收执行确实高度依赖地方协商。
  - 作者提醒：目前没有证据支持将这一模式推广到整个晚清中国。
- Prompt shown to participant: 你会接受、修改还是拒绝这个说法？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: 原研究与当前句子讨论的是同一类 outcome，但只覆盖江南两个县。AI 不当地把结果扩大到了晚清全国范围。

### POST_D2
- Category: `scope-generalization`
- Domain: `Financial Analysis`
- 题干：我在写一段零售行业评论。我输入给 AI 的 prompt 是：『根据这份案例材料，用一句话总结生成式 AI 对利润率的影响，给行业段落收尾。』
- AI 输出：从当前案例看，生成式 AI 已开始在零售行业体现利润改善效果，尤其在客服和商品文案环节，这种提升大概率会在多数细分赛道持续复制。
- 事实情况：
  - 来源材料描述了一家服装零售企业为期三个月的生成式 AI 试点。
  - 试点主要用于客服回复草拟和商品文案生成，两项流程的人力耗时均有下降。
  - 同期利润率略有改善，但材料同时提到库存折扣收缩和季节性销售回升。
  - 作者提醒：这只是单一企业、短周期案例，不能直接推及其他零售细分赛道，也不能据此判断持续利润效果。
- Prompt shown to participant: 你会如何处理这句话？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: 材料最多支持“单一服装零售案例中，流程效率改善与利润率小幅改善同期出现”，不支持把这种结果扩展为零售行业多数细分赛道的可持续规律。
