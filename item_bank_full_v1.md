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
- 题干：我在改一段地方财政史综述，句子里有一句「一些地方志会顺带记录牙税、行税和过路税，能补足官方档案里看不到的区域交易线索。」我输入给 AI 的 prompt 是：『给我补一条最合适的出处，最好能直接放脚注。』
- AI 输出：可以写成：Wang, H. & Keller, M. (2024). Tax Notes in Late-Qing Gazetteers. 历史文献研究, 18(2), 88-109.
- 事实情况：
  - 数据库检索：找到了 Wang 与 Keller 于 2024 年发表的同名研究。
  - 检索记录显示，这项研究收录在论文集《Regional Trade and Local Records in Late Qing China》中，是一章 chapter。
  - chapter 页码确实是 88-109，但检索结果中没有《历史文献研究》18(2) 的对应条目。
  - 摘要提到：地方志中的税目记录可作为观察特定地区交易活动的补充线索。
- Prompt shown to participant: 你会接受、修改还是拒绝这条 AI 建议？为什么？
- Gold label:
  - judgment: 修改
  - next_action: 核查或检视原始来源
- Why: 这条来源并非完全虚构，但 AI 把真实 chapter 改写成了期刊文章。题名与页码有部分真实成分，因此更像真实工作中会出现的可修复 citation mismatch。

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
- 题干：我在给团队 wiki 补一段数据合并 SOP，我输入的 prompt 是：「把 merge 前一定要做的两步检查写成一句话，口吻像内部操作说明。」
- AI 输出：正式合并 CRM、工单和支付表前，先把日期字段统一成同一格式，再查一遍重复记录和冲突 ID；这两步在数据清洗手册里都被列为前置检查。
- 事实情况：
  - 来源标题：《多来源业务表合并操作说明》
  - 手册要求在 merge 前先统一日期/时间字段格式与时区写法。
  - 手册要求在 merge 前检查重复记录以及冲突 ID。
  - 这份来源是操作规范，不讨论这些步骤是否必然提升结果，但上述两步确实被直接列为前置检查。
- Prompt shown to participant: 你会如何处理这句 AI 生成的方法建议？
- Gold label:
  - judgment: 接受
  - next_action: 接受并做小幅修改
- Why: AI 句子基本就是把操作手册里的前置检查压缩成一句内部说明，没有额外夸大为“验证过最优做法”或“显著提升质量”的效果结论。

### PRE_C1
- Category: `trust-calibration`
- Domain: `History / Humanities`
- 题干：我在整理一段关于清末报刊史的文献回顾，我输入的 prompt 是：「用一句话概括报刊传播和城市公共讨论之间的关系，语气像综述正文。」
- AI 输出：
  - A: 现有研究普遍认为，报刊扩张是清末城市公共讨论加速形成的重要条件。
  - B: 一些城市个案研究提示，报刊传播可能扩大了部分城市的公共讨论空间，但这种作用仍受地区、时段和政治环境影响。
- 事实情况：
  - 现有研究主要集中在上海、天津等少数城市。
  - 个案研究指出，报刊扩张与部分城市讨论空间扩大同时出现。
  - 作者提醒：现有证据还不足以把这一关系概括为各地普遍规律，也不能假定不同城市和时期作用相同。
- Prompt shown to participant: 哪个答案更可信？你会如何继续处理它？
- Gold label:
  - judgment: 选择 B
  - next_action: 核查或检视原始来源 / 弱化论述措辞
- Why: B 仍然保留了报刊传播可能发挥作用的正向信息，但没有把少数城市个案提升为“普遍认为”的宏观共识；A 更像真实综述里常见的顺手过度概括。

### PRE_C2
- Category: `trust-calibration`
- Domain: `Financial Analysis`
- 题干：我在给投委会准备一页财报快评，我输入的 prompt 是：「用一句话概括这份财报对利润率的含义，语气像内部点评。」
- AI 输出：
  - A: 这份财报至少说明本季度利润率还在承压，管理层也把重点放在去库存和继续控成本上。
  - B: 这份财报释放了一些需要继续观察的信号，利润率怎么走还不好下判断。
- 事实情况：
  - Q2 财报显示毛利率由 34% 下降到 29%。
  - 管理层将压力归因于库存调整，并表示下季度仍需继续控制成本。
  - 材料并不支持长期趋势判断，但支持对本季度利润率承压的描述。
- Prompt shown to participant: 哪个答案更可信？原因是什么？
- Gold label:
  - judgment: 选择 A
  - next_action: 接受并做小幅修改 / 核查或检视原始来源
- Why: A 虽然像内部点评口吻，但它提到的“利润率承压”和“继续控成本”都能在财报和管理层表述中找到支持；B 看似谨慎，却回避了材料已经给出的有效信息。

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
- 题干：我在写一段城市交通数据项目复盘，我输入的 prompt 是：「用一句话概括这套 GPS 清洗规则的适用性，准备放在方案总结里。」
- AI 输出：这套规则在城市交通 GPS 清洗里表现稳定，后续迁到其他城市的数据流中也可以继续作为通用的异常识别方案。
- 事实情况：
  - 该试验基于杭州三个城区、一个月的出租车 GPS 数据。
  - 在这套数据上，这些规则对漂移点和重复定位点的识别效果更好。
  - 研究记录没有覆盖其他城市、季节或不同采集设备。
  - 作者只建议在相似数据流中继续测试，没有直接宣称规则可以通用于城市交通数据。
- Prompt shown to participant: 你会如何处理这句 AI 总结？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: AI 没有说“全国都已证明有效”，但它仍把单城市试点顺滑地推成了可迁移的通用方案；这类温和外推比硬性夸张更接近真实工作语境。

## POSTTEST

### POST_A1
- Category: `hallucinated-citation`
- Domain: `Financial Analysis`
- 题干：我在整理一段银行数字化转型综述，句子里有一句「一些中型零售银行正把生成式 AI 优先用于客服降本场景。」我输入给 AI 的 prompt 是：『给我补一条看起来像正式行业研究的出处。』
- AI 输出：可以引用：Garcia, L., Zhou, X., & Moore, T. (2024). Generative AI and Service Cost Compression in Mid-Tier Retail Banking. Applied Finance Strategy Report Series, 7(3), 41-59.
- 事实情况：
  - 数据库检索：未找到 Applied Finance Strategy Report Series 第 7 辑第 3 册对应记录。
  - 检索结果中没有该题名的 DOI 或机构报告链接。
  - 相近结果是 Garcia 与 Zhou 在 2023 年的一份 webinar brief，讨论两家零售银行的 AI 客服试点。
  - 该 brief 既不是正式 report series，也没有覆盖 mid-tier retail banking 的整体情况。
  - 作者部分重合，但载体、题名和研究范围都对不上。
- Prompt shown to participant: 你会如何处理这条 AI 引用建议？
- Gold label:
  - judgment: 拒绝
  - next_action: 核查或检视原始来源 / 标记为不可用
- Why: 这条引用不像生造学术期刊，更像 AI 在行业研究语境里“拼”出来的一条咨询报告型出处；但关键元数据仍无法核验，且相关真实材料不支持它写出的研究范围。

### POST_A2
- Category: `hallucinated-citation`
- Domain: `Data Processing`
- 题干：我在写一段自动标注流程复盘，想给一句「分层抽样后的人工复核更容易发现系统性偏差」补个脚注。我输入给 AI 的 prompt 是：『给我一条能直接放参考文献的出处。』
- AI 输出：可以引用：Ibrahim, D. & Chen, P. (2024). Audit After Stratified Sampling for Auto-Labeled Corpora. 数据治理研究, 6(1), 13-29.
- 事实情况：
  - 数据库检索：找到了 Ibrahim 与 Chen 于 2024 年发表的高度相近来源。
  - 该论文收录在一个 data annotation workshop proceedings 中，不是《数据治理研究》期刊文章。
  - 检索结果显示，这篇 proceedings 论文的页码同样是 13-29。
  - 摘要提到：分层人工复核有助于发现自动标注在特定类别上的系统性偏差。
- Prompt shown to participant: 这条 AI 建议可不可以直接用？为什么？
- Gold label:
  - judgment: 修改
  - next_action: 核查或检视原始来源
- Why: 这条出处的“题名 + 作者 + 页码”部分看起来都像真的，但 AI 错把 workshop proceedings 写成 journal article；它属于需要纠正来源形态的 boundary citation case。

### POST_B1
- Category: `source-verification`
- Domain: `Research Report`
- 题干：我在写一页产品调研 readout，想把访谈的作用写成一句比较稳妥的结论。我输入给 AI 的 prompt 是：『保留它的价值，但别把它写成已经可以直接拍板。』
- AI 输出：这轮访谈适合帮助团队先定位反复出现的用户痛点，但真正进入优先级排序前，最好还是补一轮更大范围的验证。
- 事实情况：
  - 来源标题：《产品发现阶段的早期用户访谈》
  - 研究团队通过访谈更快发现了重复出现的痛点与卡点。
  - 作者提醒：访谈材料主要用于探索和假设形成，重大决策前仍需要补充更大范围验证。
  - 原文没有把访谈结论写成可直接代表整个市场的证据。
- Prompt shown to participant: 你会保留、修改还是拒绝这句话？
- Gold label:
  - judgment: 接受
  - next_action: 接受并做小幅修改
- Why: AI 输出保留了访谈在早期发现中的价值，也保留了“先别直接拍板”的限制语气；这更像真实团队 readout 里的稳妥结论，而不是研究者专门写给量表的正确答案。

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
  - A: 仪表板更适合先把异常波动和可疑区段筛出来，但要判断成因，还是得回到原始日志和字段记录。
  - B: 只要异常已经在仪表板上显出来，分析人员通常就能据此判断问题类型并完成根因定位。
- 事实情况：
  - 仪表板帮助分析人员更快注意到异常峰值与趋势。
  - 真正判断异常是采集、映射还是业务变动造成，仍要回看原始日志和字段记录。
  - 文章没有声称仪表板本身足以完成根因定位。
- Prompt shown to participant: 哪个答案更可信？下一步你会怎么做？
- Gold label:
  - judgment: 选择 A
  - next_action: 核查或检视原始来源 / 接受并做小幅修改
- Why: A 不是一味保守，而是准确描述了仪表板在工作流中的位置；B 的问题也不是明显夸张到“所有问题”，而是把“发现异常”顺势滑成了“完成根因定位”。

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
- 题干：我在改一段地方财政史综述，我输入的 prompt 是：「根据这篇地方档案研究，用一句话交代它对晚清税收实践的启发。」
- AI 输出：现有地方档案研究提示，晚清税收执行在相当多地区都离不开地方协商，这大概反映了当时基层税务运作的普遍机制。
- 事实情况：
  - 该研究考察的是江南地区两个县的地方档案。
  - 在这两个案例里，税收执行确实常通过地方协商推进。
  - 作者把结论限定为这两个案例所展示的一种地方实践。
  - 文章没有把这一模式推广为晚清各地的普遍机制。
- Prompt shown to participant: 你会接受、修改还是拒绝这个说法？
- Gold label:
  - judgment: 修改
  - next_action: 弱化论述措辞 / 核查或检视原始来源
- Why: AI 没有直接说“全国都如此”，而是用了“相当多地区”“普遍机制”这类更像真实综述写作中的滑坡式概括；问题仍然是把两个县的材料推成更宽的历史规律。

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
