/* Skill 目录。
 *
 * 与旧版 apps.ts 的两点不同：
 *
 * 1. 文案直接以中英双语内联（zh / en），不再走 messages/*.json 的 Store.apps.*。
 *    原因：目录有二十余条、每条含名称/简介/描述/能力清单，拆成两套字典后
 *    极易出现一侧漏键导致整页回退到中文。内联后类型可校验，也便于与
 *    m9ai-skills 仓库的 CATALOG.md 对照维护。
 *    页面级 UI 文案（标题、筛选项等）仍然走字典。
 *
 * 2. 不再有 rating / screenshotUrls。市集现阶段是陈列目录而非交易货架，
 *    编造评分与不存在的截图对 B2B 站点是负资产；可验证的信号改为
 *    status（真实交付状态）、roles、runtime、offline 等结构性字段。
 *
 * 字段口径见 m9ai-skills/docs/TAXONOMY.md。
 */

export type SkillCategory =
  | 'finance'
  | 'legal'
  | 'data'
  | 'content'
  | 'files'
  | 'document'
  | 'devops'
  | 'travel'
  | 'life';

/** 交付状态：只有 available / developing 是真实存在的，planned 属公开路线图。 */
export type SkillStatus = 'available' | 'developing' | 'planned';

/** zero = 仅 Node 内置能力，零第三方依赖；external 需在详情页列明外部依赖。 */
export type SkillRuntime = 'zero' | 'shell' | 'external';

export type SkillRole =
  | 'finance'
  | 'legal'
  | 'hr'
  | 'admin'
  | 'ops'
  | 'sales'
  | 'marketing'
  | 'executive'
  | 'dev'
  | 'devops'
  | 'design'
  | 'general';

export interface SkillCopy {
  name: string;
  /** 卡片上的一句话价值 */
  tagline: string;
  /** 详情页正文 */
  description: string;
  capabilities: string[];
  scenarios: string[];
}

export interface Skill {
  id: string;
  category: SkillCategory;
  roles: SkillRole[];
  runtime: SkillRuntime;
  /** full = 完全离线；cache = 联网同步 + 本地缓存 + 内置兜底 */
  offline: 'full' | 'cache';
  status: SkillStatus;
  /** m9ai-skills 仓库中的目录名（未建仓时省略） */
  repo?: string;
  /** SKILL.md frontmatter 的 version，与发布 tag `{repo}/v{version}` 一致（未发布时省略） */
  version?: string;
  zh: SkillCopy;
  en: SkillCopy;
}

/** 技能包发布仓库。详情页的安装说明与下载入口共用，仓库改名时只需改这里。 */
export const skillsRepoSlug = 'm9ai/m9ai-skills';
export const skillsRepoUrl = `https://github.com/${skillsRepoSlug}`;
export const skillsReleasesUrl = `${skillsRepoUrl}/releases`;

/**
 * 是否已发布到技能包仓库。只有这种情况才能给出可执行的安装步骤，
 * 避免给「开发中 / 规划中」的条目编造下载链接与命令。
 */
export function isInstallable(skill: Skill): boolean {
  return skill.status === 'available' && Boolean(skill.repo);
}

/** 命令行安装命令；未发布时返回空串。 */
export function cliInstallCommand(skill: Skill): string {
  return skill.repo ? `npx skills add ${skillsRepoSlug} --skill ${skill.repo}` : '';
}

export const skillCategories: SkillCategory[] = [
  'finance',
  'legal',
  'data',
  'content',
  'files',
  'document',
  'devops',
  'travel',
  'life',
];

export const skillRoles: SkillRole[] = [
  'finance',
  'legal',
  'hr',
  'admin',
  'ops',
  'sales',
  'marketing',
  'executive',
  'dev',
  'devops',
  'design',
  'general',
];

export const skillStatuses: SkillStatus[] = ['available', 'developing', 'planned'];

export const skills: Skill[] = [
  // ---------------------------------------------------------------- travel
  {
    id: 'jinshan-train',
    category: 'travel',
    roles: ['general'],
    runtime: 'zero',
    offline: 'cache',
    status: 'available',
    repo: 'jinshan-train-skill',
    version: '1.0.0',
    zh: {
      name: '金山铁路时刻表',
      tagline: '查询上海金山铁路班次、经停站、票价与下一班车',
      description:
        '提供上海金山铁路（上海南 ↔ 金山卫，单线 9 站）的班次查询能力。所有结果由脚本实时计算：首次执行联网同步线上时刻表并写入本地缓存，之后优先读缓存，离线时回退到内置兜底数据并明确标注「可能过期」。',
      capabilities: [
        '两站之间的班次检索（支持直达 / 大站停 / 站站停筛选）',
        '某趟车次的经停站与到发时刻',
        '某站的下一班车（区分平日与节假日方案）',
        '票价、站点地址与换乘信息',
      ],
      scenarios: ['班次查询', '票价'],
    },
    en: {
      name: 'Jinshan Railway Schedule',
      tagline: 'Schedules, stops, fares and next departures for Shanghai Jinshan Railway',
      description:
        'Query trains on the Shanghai Jinshan Railway (Shanghai South ↔ Jinshanwei, 9 stations). Every answer is computed by script: the first run syncs the online timetable into a local cache, later runs read the cache, and offline it falls back to bundled data clearly marked as possibly outdated.',
      capabilities: [
        'Search trains between any two stations (express / semi-express / local)',
        'Stops and arrival-departure times for a given train',
        'Next departure from a station (weekday vs holiday patterns)',
        'Fares, station addresses and transfer information',
      ],
      scenarios: ['Timetables', 'Fares'],
    },
  },

  // ------------------------------------------------------------------ life
  {
    id: 'shanghai-school-district',
    category: 'life',
    roles: ['general'],
    runtime: 'zero',
    offline: 'cache',
    status: 'developing',
    repo: 'shanghai-school-district-skill',
    zh: {
      name: '上海学区查询',
      tagline: '按小区或地址查询上海对口学校与学区划分',
      description:
        '面向上海升学场景的学区对口查询。输入小区名或地址，返回对口小学 / 初中与所属街区信息；数据随教育部门公示同步更新，离线时使用内置快照并标注数据日期。',
      capabilities: [
        '按小区或地址查询对口学校',
        '查看所属街道与招生范围说明',
        '数据日期与来源标注',
      ],
      scenarios: ['学区'],
    },
    en: {
      name: 'Shanghai School District Lookup',
      tagline: 'Find the catchment schools for a Shanghai address or residence',
      description:
        'School district lookup for Shanghai. Give a residence name or address and get the assigned primary / junior secondary schools plus the street block. Data is synced from official publications and, when offline, served from a bundled snapshot with its date clearly shown.',
      capabilities: [
        'Look up catchment schools by residence or address',
        'Show the street block and enrolment scope',
        'Data date and source labelling',
      ],
      scenarios: ['School districts'],
    },
  },

  // --------------------------------------------------------------- finance
  {
    id: 'amount-to-chinese',
    category: 'finance',
    roles: ['finance', 'admin'],
    runtime: 'zero',
    offline: 'full',
    status: 'available',
    repo: 'amount-to-chinese-skill',
    version: '1.0.0',
    zh: {
      name: '金额转大写',
      tagline: '人民币金额转中文大写，批量处理发票与合同金额',
      description:
        '把阿拉伯数字金额转成符合票据规范的人民币中文大写（含「零」「整」「佰拾万仟」等规则与角分处理）。支持单条转换，也支持批量读取清单文件逐行输出，避免手工誊写出错。',
      capabilities: [
        '符合票据规范的大写转换（零 / 整 / 角分规则）',
        '负数、零、超大金额边界处理',
        '批量读取清单逐行转换',
      ],
      scenarios: ['发票', '记账'],
    },
    en: {
      name: 'Amount to Chinese Capital',
      tagline: 'Convert amounts into Chinese capital form for invoices and contracts',
      description:
        'Converts numeric amounts into the Chinese capital form required on invoices, handling zero, "整", jiao/fen and large-value edge cases. Works on single values or in batch from a list file, removing manual transcription errors.',
      capabilities: [
        'Invoice-compliant capital conversion (zero / 整 / jiao-fen rules)',
        'Negative, zero and very large amount edge cases',
        'Batch conversion line by line from a list',
      ],
      scenarios: ['Invoices', 'Bookkeeping'],
    },
  },
  {
    id: 'invoice-field-checker',
    category: 'finance',
    roles: ['finance'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '发票要素校验',
      tagline: '批量校验发票号码校验位、金额税额勾稽与开票日期',
      description:
        '对一批发票记录做要素级校验：号码与代码校验位是否正确、金额与税额是否符合税率勾稽、开票日期是否合理。输出逐条结果与汇总统计，便于在入账前发现问题票据。',
      capabilities: [
        '发票代码与号码校验位验证',
        '金额 / 税额 / 税率勾稽关系检查',
        '开票日期合理性与重复票号检查',
        '批量输出结果与问题汇总',
      ],
      scenarios: ['发票', '对账'],
    },
    en: {
      name: 'Invoice Field Validator',
      tagline: 'Batch-validate invoice check digits, amount/tax consistency and issue dates',
      description:
        'Validates a batch of invoice records at field level: code and number check digits, amount/tax consistency against the stated rate, and plausible issue dates. Emits per-row results plus a summary so problem invoices surface before posting.',
      capabilities: [
        'Invoice code and number check digit verification',
        'Amount / tax / rate consistency checks',
        'Issue date plausibility and duplicate number detection',
        'Batch output with an issue summary',
      ],
      scenarios: ['Invoices', 'Reconciliation'],
    },
  },
  {
    id: 'bank-reconciliation',
    category: 'finance',
    roles: ['finance'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '银行流水对账',
      tagline: '两方账单按金额与日期模糊匹配，输出未达账项',
      description:
        '读入企业账面流水与银行流水两份清单，按金额 + 日期窗口做模糊匹配，输出已匹配、仅一方存在（未达账项）与金额不符的条目，并给出差异合计。全程本地计算，账单数据不出本机。',
      capabilities: [
        '金额 + 日期窗口的模糊匹配',
        '未达账项与金额不符条目清单',
        '差异合计与匹配率统计',
        '支持 CSV 输入，结果可导出',
      ],
      scenarios: ['对账', '记账'],
    },
    en: {
      name: 'Bank Reconciliation',
      tagline: 'Fuzzy-match two statements by amount and date, list the unmatched items',
      description:
        'Takes the book ledger and the bank statement and fuzzy-matches them on amount plus a date window. Reports matched rows, items present on only one side (uncleared items) and amount mismatches, with a difference total. Runs entirely locally so statement data never leaves the machine.',
      capabilities: [
        'Fuzzy matching on amount plus a date window',
        'Uncleared items and amount mismatch lists',
        'Difference totals and match-rate statistics',
        'CSV input with exportable results',
      ],
      scenarios: ['Reconciliation', 'Bookkeeping'],
    },
  },
  {
    id: 'expense-audit',
    category: 'finance',
    roles: ['finance', 'admin'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '报销单据检查',
      tagline: '检查报销清单的必填项、金额合计、超标项与重复票据',
      description:
        '在付款前对报销清单做一轮机械检查：必填字段是否齐全、分项合计与总金额是否吻合、是否超出标准额度、票号是否重复。输出可执行的退回意见清单。',
      capabilities: [
        '必填字段完整性检查',
        '分项合计与总金额勾稽',
        '超标项与重复票号检查',
        '生成退回意见清单',
      ],
      scenarios: ['报销'],
    },
    en: {
      name: 'Expense Claim Audit',
      tagline: 'Check required fields, totals, over-limit items and duplicate receipts',
      description:
        'A mechanical pre-payment pass over expense claims: required fields present, line items summing to the claimed total, items over policy limits, duplicate receipt numbers. Produces an actionable list of items to send back.',
      capabilities: [
        'Required field completeness check',
        'Line item vs total consistency',
        'Over-limit and duplicate receipt detection',
        'Actionable rejection list',
      ],
      scenarios: ['Expense claims'],
    },
  },

  // ----------------------------------------------------------------- legal
  {
    id: 'deadline-calculator',
    category: 'legal',
    roles: ['legal', 'hr'],
    runtime: 'zero',
    offline: 'full',
    status: 'available',
    repo: 'deadline-calculator-skill',
    version: '1.0.0',
    zh: {
      name: '期限计算',
      tagline: '按民法典口径推算期限届满日，休假日自动顺延',
      description:
        '用于诉讼时效、答辩期、合同到期、试用期届满等场景的期限推算。默认按民法典口径（开始的当日不计入，自次日起算）；届满日落在法定休假日或周休息日时自动顺延，并逐日列出顺延原因便于复核。工作日口径需先填入当年度放假安排（法定休假日与调休上班日）后才能使用。',
      capabilities: [
        '民法典口径：开始当日不计入，自次日起算',
        '届满日落在休假日自动顺延，逐日列出跳过原因',
        '按日 / 按月 / 按年推算，输出起算日与届满日',
        '工作日口径需先填年度放假安排（含调休上班日）',
      ],
      scenarios: ['期限计算', '合同审查'],
    },
    en: {
      name: 'Deadline Calculator',
      tagline: 'Compute deadlines under the Civil Code, with automatic holiday rollover',
      description:
        'Deadline computation for limitation periods, response windows, contract expiry and probation end. Uses the Civil Code convention by default (the starting day is excluded; counting begins the next day). When the expiry date lands on a statutory holiday or weekly rest day it rolls forward automatically and lists each skipped day for review. Working-day counting requires the current year holiday schedule to be filled in first.',
      capabilities: [
        'Civil Code convention: starting day excluded, counting from the next day',
        'Automatic rollover off rest days, with a per-day reason list',
        'By day / month / year, reporting start and expiry dates',
        'Working-day mode needs the annual holiday schedule filled in first',
      ],
      scenarios: ['Deadlines', 'Contract review'],
    },
  },
  {
    id: 'pii-redactor',
    category: 'legal',
    roles: ['legal', 'dev', 'admin'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '敏感信息脱敏',
      tagline: '识别并脱敏手机号、身份证号、银行卡号、邮箱与住址',
      description:
        '在文档外发、日志共享、演示数据准备等场景，先对文本做本地脱敏再交出去。支持保留格式的部分掩码（如 138****8000）与整体替换两种策略，并可输出命中位置清单以便复核。',
      capabilities: [
        '手机号 / 身份证 / 银行卡 / 邮箱 / 住址识别',
        '保留格式的部分掩码与整体替换两种策略',
        '输出命中位置清单便于复核',
        '纯本地处理，原始文本不出本机',
      ],
      scenarios: ['脱敏', '合规检查'],
    },
    en: {
      name: 'PII Redactor',
      tagline: 'Detect and mask phone numbers, ID numbers, bank cards, emails and addresses',
      description:
        'Redact sensitive values locally before sharing documents, logs or demo data. Offers format-preserving partial masking (e.g. 138****8000) and full replacement, and can emit a hit list with positions for review. Everything runs locally; the source text never leaves the machine.',
      capabilities: [
        'Phone / ID / bank card / email / address detection',
        'Format-preserving masking or full replacement',
        'Hit list with positions for review',
        'Fully local processing',
      ],
      scenarios: ['Redaction', 'Compliance'],
    },
  },
  {
    id: 'contract-checklist',
    category: 'legal',
    roles: ['legal'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '合同要素检查',
      tagline: '检查合同是否包含必备条款，缺失项逐条列出',
      description:
        '对合同文本做结构级检查：主体、标的、数量与质量、价款、履行期限与地点、违约责任、争议解决等必备条款是否存在。脚本负责确定性的存在性与编号检查，条款实质是否公平由 Agent 阅读理解后判断。',
      capabilities: [
        '必备条款存在性检查',
        '条款编号断号与交叉引用失效检查',
        '主体、金额、日期等要素提取',
        '缺失项清单输出，语义判断交由 Agent',
      ],
      scenarios: ['合同审查', '条款检查'],
    },
    en: {
      name: 'Contract Checklist',
      tagline: 'Check whether a contract contains all required clauses, list what is missing',
      description:
        'A structural pass over contract text: are parties, subject matter, quantity and quality, price, performance period and place, breach liability and dispute resolution all present. The script does deterministic presence and numbering checks; whether a clause is substantively fair is left to the Agent reading the text.',
      capabilities: [
        'Required clause presence check',
        'Clause numbering gaps and broken cross-references',
        'Extraction of parties, amounts and dates',
        'Missing-item list, semantic judgement delegated to the Agent',
      ],
      scenarios: ['Contract review', 'Clause check'],
    },
  },
  {
    id: 'file-evidence-seal',
    category: 'legal',
    roles: ['legal', 'devops'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '文件证据固化',
      tagline: '为目录生成可事后核验的 SHA-256 清单',
      description:
        '对一个目录及其所有文件计算 SHA-256，生成含时间戳与文件大小的清单文件。之后任何改动都能通过重新计算比对发现（新增 / 删除 / 修改），适用于电子证据固定、交付物留痕与备份完整性核验。',
      capabilities: [
        '递归计算 SHA-256 并生成清单文件',
        '事后重新比对，识别新增 / 删除 / 修改',
        '含时间戳与文件大小信息',
        '两份目录结果可直接对比',
      ],
      scenarios: ['证据固化'],
    },
    en: {
      name: 'File Evidence Seal',
      tagline: 'Generate a verifiable SHA-256 manifest for a directory',
      description:
        'Computes SHA-256 for a directory and every file in it, writing a manifest with timestamps and sizes. Any later change is detectable by recomputing and diffing (added / removed / modified). Intended for evidence preservation, delivery records and backup verification.',
      capabilities: [
        'Recursive SHA-256 computation with a manifest file',
        'Later re-verification: added / removed / modified',
        'Timestamps and file sizes included',
        'Two manifests can be compared directly',
      ],
      scenarios: ['Evidence preservation'],
    },
  },

  // ------------------------------------------------------------------ data
  {
    id: 'csv-cleaner',
    category: 'data',
    roles: ['ops', 'finance', 'sales'],
    runtime: 'zero',
    offline: 'full',
    status: 'available',
    repo: 'csv-cleaner-skill',
    version: '1.0.0',
    zh: {
      name: 'CSV 清洗',
      tagline: '编码检测、分隔符嗅探、去空行、类型归一化与日期标准化',
      description:
        '把来源混乱的 CSV 变成可分析的干净表：自动检测编码与分隔符、去掉空行与首尾空白、统一数字与日期格式、按 RFC4180 处理引号转义，并给出列级体检报告（类型、空值、唯一值、非法日期）。8 位编号（如订单号）默认不会被误判为日期。',
      capabilities: [
        '编码检测（UTF-8 / GBK / BOM）与分隔符嗅探',
        '去空行、去首尾空白、数字与日期归一化',
        '列级体检：类型、空值、唯一值、非法日期',
        '清洗报告说明每项改动，不做静默修改',
      ],
      scenarios: ['数据清洗', '编码处理'],
    },
    en: {
      name: 'CSV Cleaner',
      tagline: 'Encoding detection, delimiter sniffing, type normalisation, date standardisation',
      description:
        'Turns a messy CSV into something analysable: detects encoding and delimiter, strips blank rows and padding, normalises numbers and dates, handles RFC4180 quoted escapes, and reports per-column health (type, blanks, unique counts, invalid dates). Eight-digit identifiers such as order numbers are not mistaken for dates.',
      capabilities: [
        'Encoding detection (UTF-8 / GBK / BOM) and delimiter sniffing',
        'Blank rows and padding removed; number and date normalisation',
        'Per-column health: type, blanks, unique counts, invalid dates',
        'Cleaning report per change, nothing mutated silently',
      ],
      scenarios: ['Data cleaning', 'Encoding'],
    },
  },
  {
    id: 'csv-aggregator',
    category: 'data',
    roles: ['ops', 'sales', 'executive'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: 'CSV 统计汇总',
      tagline: '分组聚合与常用统计，输出可直接引用的结果',
      description:
        '对表格做分组聚合与描述性统计：求和、均值、中位数、分位数、最大最小值、TopN。支持按一列或多列分组，结果可输出为表格或 Markdown，便于直接贴进报告。',
      capabilities: [
        '按单列或多列分组聚合',
        '求和 / 均值 / 中位数 / 分位数 / 极值',
        'TopN 排行',
        '结果输出为表格或 Markdown',
      ],
      scenarios: ['汇总统计', '报表生成'],
    },
    en: {
      name: 'CSV Aggregator',
      tagline: 'Group-by aggregation and descriptive statistics ready to cite',
      description:
        'Group-by aggregation and descriptive statistics over a table: sum, mean, median, quantiles, min/max and TopN. Groups by one or more columns and can emit results as a table or Markdown ready to paste into a report.',
      capabilities: [
        'Group by one or more columns',
        'Sum / mean / median / quantiles / extremes',
        'TopN ranking',
        'Output as table or Markdown',
      ],
      scenarios: ['Aggregation', 'Reporting'],
    },
  },
  {
    id: 'data-quality-checker',
    category: 'data',
    roles: ['ops'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '数据质量体检',
      tagline: '空值率、唯一性、异常值与枚举合法性体检报告',
      description:
        '对一份表格做整体体检：每列的空值率、唯一值分布、类型一致性、数值异常值、枚举字段的非法取值，并给出问题列排名。适合在导入系统或对外报送前跑一遍。',
      capabilities: [
        '空值率与唯一性统计',
        '类型一致性与枚举合法性检查',
        '数值异常值识别',
        '问题列排名体检报告',
      ],
      scenarios: ['质量体检'],
    },
    en: {
      name: 'Data Quality Checker',
      tagline: 'Null rates, uniqueness, outliers and enum validity in one report',
      description:
        'A full health check of a table: per-column null rates, value distribution, type consistency, numeric outliers and invalid enum values, with columns ranked by severity. Run it before loading data into a system or sending it out.',
      capabilities: [
        'Null rate and uniqueness statistics',
        'Type consistency and enum validity',
        'Numeric outlier detection',
        'Severity-ranked column report',
      ],
      scenarios: ['Quality check'],
    },
  },
  {
    id: 'csv-diff',
    category: 'data',
    roles: ['ops', 'finance'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '表格差异比对',
      tagline: '按关键列比对两份表格，输出新增、删除与变更',
      description:
        '比对两份结构相近的表格（如本月与上月、导出前后）：按关键列对齐，列出新增行、删除行与发生变更的字段及新旧值。支持忽略指定列与浮点容差。',
      capabilities: [
        '按关键列对齐两表',
        '输出新增 / 删除 / 变更及新旧值',
        '支持忽略列与浮点容差',
        '差异汇总统计',
      ],
      scenarios: ['差异比对', '去重'],
    },
    en: {
      name: 'Table Diff',
      tagline: 'Compare two tables by key column: added, removed and changed rows',
      description:
        'Compares two structurally similar tables (this month vs last, before vs after an export): aligns rows on a key column and lists added rows, removed rows, and changed fields with old and new values. Supports ignored columns and float tolerance.',
      capabilities: [
        'Row alignment on a key column',
        'Added / removed / changed with old and new values',
        'Ignored columns and float tolerance',
        'Difference summary counts',
      ],
      scenarios: ['Diffing', 'Deduplication'],
    },
  },

  // --------------------------------------------------------------- content
  {
    id: 'banned-word-checker',
    category: 'content',
    roles: ['ops', 'marketing'],
    runtime: 'zero',
    offline: 'full',
    status: 'available',
    repo: 'banned-word-checker-skill',
    version: '1.0.0',
    zh: {
      name: '违禁词检测',
      tagline: '检测平台违禁词及其常见变体，语义变体交由 Agent 判断',
      description:
        '对文案做发布前的违禁词扫描。脚本负责字形层面的确定性部分：词库命中，以及全角半角、插入空格与符号、零宽字符、跨行拆分等规避写法；词表中已列出的拼音与同音别名同样能命中。真正隐晦的表达（比喻、黑话）由 Agent 阅读理解后判断。支持挂载企业自有词表。',
      capabilities: [
        '字形层面变体识别（全角 / 空格 / 符号 / 零宽 / 跨行）',
        '支持挂载企业自有词表（含拼音与同音别名）',
        '输出命中行号、原文片段与上下文便于人工复核',
        '隐晦语义变体交由 Agent 判断',
      ],
      scenarios: ['违禁词', '合规检查'],
    },
    en: {
      name: 'Banned Word Checker',
      tagline: 'Detect banned terms and common evasions; semantic variants go to the Agent',
      description:
        'Pre-publish scan for banned wording. The script handles the orthographic, deterministic part: dictionary hits plus evasions such as full-width forms, inserted spaces or symbols, zero-width characters and line-break splitting; pinyin and homophone aliases listed in the word list are matched too. Genuinely subtle phrasing (metaphor, slang) is left to the Agent reading the copy. Custom company word lists can be mounted.',
      capabilities: [
        'Orthographic evasion detection (full-width / spacing / symbols / zero-width / line breaks)',
        'Custom company word lists, including pinyin and homophone aliases',
        'Hit line numbers, matched text and context for human review',
        'Subtle semantic variants delegated to the Agent',
      ],
      scenarios: ['Banned words', 'Compliance'],
    },
  },
  {
    id: 'pii-leak-scanner',
    category: 'content',
    roles: ['ops', 'legal', 'dev'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '敏感信息泄露检测',
      tagline: '扫描文本中的手机号、身份证、银行卡、邮箱与密钥',
      description:
        '在对外发布、提交代码或共享文档前，扫描其中是否夹带了手机号、身份证号、银行卡号、邮箱地址或疑似密钥 / AccessKey。输出命中类型、位置与掩码后的样例，原始值不回显。',
      capabilities: [
        '手机号 / 身份证 / 银行卡 / 邮箱识别',
        '疑似密钥、AccessKey、私钥头检测',
        '输出掩码样例，不回显原始值',
        '支持目录级批量扫描',
      ],
      scenarios: ['敏感信息'],
    },
    en: {
      name: 'PII Leak Scanner',
      tagline: 'Scan text for phone numbers, ID numbers, bank cards, emails and keys',
      description:
        'Before publishing, committing or sharing, scan for embedded phone numbers, ID numbers, bank card numbers, email addresses or suspected keys / access keys. Reports the hit type, position and a masked sample; raw values are never echoed back.',
      capabilities: [
        'Phone / ID / bank card / email detection',
        'Suspected keys, access keys and private key headers',
        'Masked samples only, raw values never echoed',
        'Directory-wide batch scanning',
      ],
      scenarios: ['Sensitive data'],
    },
  },
  {
    id: 'ad-law-risk-checker',
    category: 'content',
    roles: ['marketing', 'ops'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '极限词检测',
      tagline: '检测广告法风险词，如「最」「第一」「国家级」',
      description:
        '扫描营销文案中的广告法风险表述：绝对化用语、虚假夸大、涉及国家机关或奖项的不当表述等。输出风险等级与位置，并给出更稳妥的改写方向（改写由 Agent 完成）。',
      capabilities: [
        '绝对化用语与夸大表述识别',
        '涉及国家机关、奖项的不当表述检查',
        '风险等级与命中位置输出',
        '改写建议交由 Agent 生成',
      ],
      scenarios: ['极限词', '合规检查'],
    },
    en: {
      name: 'Ad Law Risk Checker',
      tagline: 'Flag advertising-law risk wording such as superlatives and false claims',
      description:
        'Scans marketing copy for advertising-law risk: superlative and absolute claims, exaggerated statements, and improper references to state bodies or awards. Reports risk level and position, then suggests safer directions (rewriting is done by the Agent).',
      capabilities: [
        'Absolute and exaggerated claim detection',
        'Improper references to state bodies or awards',
        'Risk level and hit positions',
        'Rewriting suggestions generated by the Agent',
      ],
      scenarios: ['Superlatives', 'Compliance'],
    },
  },

  // ----------------------------------------------------------------- files
  {
    id: 'batch-rename',
    category: 'files',
    roles: ['admin', 'design', 'dev'],
    runtime: 'zero',
    offline: 'full',
    status: 'available',
    repo: 'batch-rename-skill',
    version: '1.0.0',
    zh: {
      name: '批量重命名',
      tagline: '按规则重命名大量文件，先预览再执行且可撤销',
      description:
        '按序号、日期、正则替换、大小写转换、前后缀与扩展名等规则批量重命名。执行前输出完整的「原名 → 新名」预览，确认后才落盘，并生成撤销清单可一条命令回滚。冲突检测会拦下重名与覆盖既有文件的情况。',
      capabilities: [
        '序号 / 日期 / 正则 / 大小写 / 前后缀等规则',
        '执行前完整预览，确认后才落盘',
        '生成撤销清单，一条命令回滚',
        '冲突检测：拦下重名与覆盖既有文件',
      ],
      scenarios: ['批量重命名'],
    },
    en: {
      name: 'Batch Rename',
      tagline: 'Rename many files by rule: preview first, execute, and undo',
      description:
        'Bulk renaming by sequence, date, regex substitution, case conversion, prefix, suffix and extension rules. Prints a full old-to-new preview before touching anything, applies only after confirmation, and writes an undo manifest for one-command rollback. Collision detection blocks duplicate names and overwriting existing files.',
      capabilities: [
        'Sequence / date / regex / case / prefix-suffix rules',
        'Full preview before write, confirmation required',
        'Undo manifest for one-command rollback',
        'Collision detection: duplicate names and overwrite blocking',
      ],
      scenarios: ['Batch rename'],
    },
  },
  {
    id: 'duplicate-file-finder',
    category: 'files',
    roles: ['admin', 'devops'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '重复文件检测',
      tagline: '按内容哈希找出重复文件，先出组再决定是否清理',
      description:
        '按内容哈希（而非文件名）扫描目录，把完全相同的文件归组，显示每组占用的空间。只输出分组结果，是否删除由用户确认，避免误删。适合磁盘清理与资料库去重。',
      capabilities: [
        '按内容哈希分组，不受文件名影响',
        '显示每组数量与可回收空间',
        '只输出分组，删除需用户确认',
        '支持按大小与类型过滤',
      ],
      scenarios: ['去重'],
    },
    en: {
      name: 'Duplicate File Finder',
      tagline: 'Group identical files by content hash; you decide what to delete',
      description:
        'Scans a directory by content hash rather than filename, grouping byte-identical files and showing the space each group occupies. It only reports groups — deletion always requires confirmation — which makes it safe for disk cleanup and archive deduplication.',
      capabilities: [
        'Content-hash grouping independent of filenames',
        'Per-group counts and reclaimable space',
        'Report only; deletion requires confirmation',
        'Filter by size and type',
      ],
      scenarios: ['Deduplication'],
    },
  },
  {
    id: 'dir-fingerprint',
    category: 'files',
    roles: ['devops', 'legal'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '目录指纹比对',
      tagline: '生成目录指纹并比对两份目录的差异',
      description:
        '为一个目录生成指纹清单（路径 + 哈希 + 大小 + 修改时间），可与另一份清单比对，快速找出新增、删除与内容变更的文件。适用于发布前后核对、备份校验与交付物比对。',
      capabilities: [
        '生成路径 + 哈希 + 大小 + 时间的指纹清单',
        '两份清单比对，输出新增 / 删除 / 变更',
        '支持忽略指定路径模式',
        '结果可导出为清单文件',
      ],
      scenarios: ['目录比对', '完整性校验'],
    },
    en: {
      name: 'Directory Fingerprint',
      tagline: 'Fingerprint a directory and diff two snapshots',
      description:
        'Produces a fingerprint manifest (path + hash + size + mtime) for a directory and diffs it against another, quickly surfacing added, removed and modified files. Useful for pre/post release checks, backup verification and delivery comparison.',
      capabilities: [
        'Manifest of path + hash + size + mtime',
        'Diff two manifests: added / removed / modified',
        'Ignore path patterns',
        'Exportable manifest files',
      ],
      scenarios: ['Directory diff', 'Integrity'],
    },
  },

  // -------------------------------------------------------------- document
  {
    id: 'markdown-linter',
    category: 'document',
    roles: ['dev', 'admin'],
    runtime: 'zero',
    offline: 'full',
    status: 'available',
    repo: 'markdown-linter-skill',
    version: '1.0.0',
    zh: {
      name: 'Markdown 规范检查',
      tagline: '检查并修复 Markdown 的标题层级、列表、链接与表格',
      description:
        '对 Markdown 文档做规范检查：标题层级是否跳级、列表缩进是否一致、链接与图片引用是否有效、代码块围栏是否闭合、表格是否对齐。可只报告问题，也可自动修复安全项。',
      capabilities: [
        '标题层级跳级与重复检查',
        '列表缩进、代码块围栏、表格对齐',
        '链接与图片引用有效性检查',
        '报告模式与自动修复模式',
      ],
      scenarios: ['Markdown', '排版'],
    },
    en: {
      name: 'Markdown Linter',
      tagline: 'Check and fix Markdown headings, lists, links and tables',
      description:
        'Lints Markdown documents: heading level jumps, list indentation, link and image references, code fence closure and table alignment. Can report only, or auto-fix the safe rules.',
      capabilities: [
        'Heading level jumps and duplicates',
        'List indentation, code fences, table alignment',
        'Link and image reference validity',
        'Report-only or auto-fix mode',
      ],
      scenarios: ['Markdown', 'Formatting'],
    },
  },
  {
    id: 'markdown-table-builder',
    category: 'document',
    roles: ['ops', 'dev'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: 'Markdown 表格生成',
      tagline: '从 CSV/TSV 生成对齐的 Markdown 表格',
      description:
        '把 CSV 或 TSV 数据转成列宽对齐的 Markdown 表格，可直接贴进文档或 README。支持选择列、指定对齐方式、处理含竖线与换行的单元格转义。',
      capabilities: [
        'CSV / TSV 转对齐的 Markdown 表格',
        '支持选列与指定列对齐方式',
        '单元格转义（竖线、换行）',
        '可直接粘贴的输出',
      ],
      scenarios: ['表格', 'Markdown'],
    },
    en: {
      name: 'Markdown Table Builder',
      tagline: 'Turn CSV/TSV into an aligned Markdown table',
      description:
        'Converts CSV or TSV into a column-aligned Markdown table ready to paste into docs or a README. Supports column selection, per-column alignment, and escaping of pipes and newlines inside cells.',
      capabilities: [
        'CSV / TSV to aligned Markdown table',
        'Column selection and per-column alignment',
        'Cell escaping (pipes, newlines)',
        'Paste-ready output',
      ],
      scenarios: ['Tables', 'Markdown'],
    },
  },
  {
    id: 'subtitle-converter',
    category: 'document',
    roles: ['ops', 'marketing'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '字幕格式转换',
      tagline: 'SRT / ASS / VTT 字幕互转与时间轴校正',
      description:
        '在常见字幕格式之间互转（SRT、ASS、VTT），并支持整体时间轴偏移或按比例缩放。转换时保留时间码精度与样式标记，输出前校验时间轴是否单调递增与重叠。',
      capabilities: [
        'SRT / ASS / VTT 互转',
        '时间轴整体偏移与按比例缩放',
        '时间码单调性与重叠校验',
        '编码自动检测（UTF-8 / GBK）',
      ],
      scenarios: ['字幕', '格式转换'],
    },
    en: {
      name: 'Subtitle Converter',
      tagline: 'Convert SRT / ASS / VTT subtitles and correct timing',
      description:
        'Converts between common subtitle formats (SRT, ASS, VTT) and supports shifting or scaling the whole timeline. Preserves timecode precision and style tags, and validates monotonic, non-overlapping cues before writing.',
      capabilities: [
        'SRT / ASS / VTT conversion',
        'Timeline shift and proportional scaling',
        'Timecode monotonicity and overlap validation',
        'Automatic encoding detection (UTF-8 / GBK)',
      ],
      scenarios: ['Subtitles', 'Conversion'],
    },
  },

  // ---------------------------------------------------------------- devops
  {
    id: 'json-toolkit',
    category: 'devops',
    roles: ['dev'],
    runtime: 'zero',
    offline: 'full',
    status: 'available',
    repo: 'json-toolkit-skill',
    version: '1.0.0',
    zh: {
      name: 'JSON 工具集',
      tagline: '格式化、批量语法校验与 TypeScript 类型生成',
      description:
        '面向研发的 JSON 处理：格式化与压缩、批量校验多个文件的语法并定位错误行、从示例 JSON 推断并生成 TypeScript interface。全部基于 Node 内置能力，无需安装依赖。',
      capabilities: [
        '格式化与压缩',
        '批量语法校验并定位错误位置',
        '从样例推断生成 TypeScript interface',
        '目录级批量处理',
      ],
      scenarios: ['类型生成', '格式转换'],
    },
    en: {
      name: 'JSON Toolkit',
      tagline: 'Format, batch-validate and generate TypeScript types',
      description:
        'JSON tooling for developers: pretty-print and minify, batch syntax validation with error positions, and TypeScript interface inference from sample JSON. Built purely on Node built-ins, no dependencies to install.',
      capabilities: [
        'Pretty-print and minify',
        'Batch validation with error positions',
        'TypeScript interface inference from samples',
        'Directory-wide batch processing',
      ],
      scenarios: ['Type generation', 'Conversion'],
    },
  },
  {
    id: 'secret-scanner',
    category: 'devops',
    roles: ['dev', 'devops'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: '密钥泄露扫描',
      tagline: '扫描代码目录中的密钥、AccessKey 与私钥特征',
      description:
        '在提交或发布前扫描代码目录，查找疑似 AccessKey / SecretKey、私钥文件头、硬编码 Token、数据库连接串等特征。输出文件路径、行号与掩码样例，不回显原始值；支持排除目录与基线忽略。',
      capabilities: [
        'AccessKey / SecretKey / Token 特征识别',
        '私钥文件头与连接串检测',
        '输出位置与掩码样例，不回显原始值',
        '支持排除目录与基线忽略',
      ],
      scenarios: ['密钥扫描', '合规检查'],
    },
    en: {
      name: 'Secret Scanner',
      tagline: 'Scan a codebase for keys, access keys and private key material',
      description:
        'Scans a code directory before commit or release for suspected access keys / secret keys, private key headers, hardcoded tokens and database connection strings. Reports file, line and a masked sample — never the raw value — with exclusion paths and a baseline ignore list.',
      capabilities: [
        'Access key / secret key / token pattern detection',
        'Private key headers and connection strings',
        'Positions with masked samples, no raw values',
        'Exclusion paths and baseline ignore list',
      ],
      scenarios: ['Secret scanning', 'Compliance'],
    },
  },
  {
    id: 'cron-explainer',
    category: 'devops',
    roles: ['devops', 'dev'],
    runtime: 'zero',
    offline: 'full',
    status: 'planned',
    zh: {
      name: 'Cron 解析与推算',
      tagline: '解析 cron 表达式，输出未来执行时间与人类可读说明',
      description:
        '解析标准 5 段与 6 段 cron 表达式，输出未来若干次的执行时间，并给出人类可读的说明（如「每天 03:00」）。支持时区指定，便于在配置定时任务前确认调度是否符合预期。',
      capabilities: [
        '5 段与 6 段 cron 表达式解析',
        '输出未来 N 次执行时间',
        '人类可读的调度说明',
        '支持指定时区',
      ],
      scenarios: ['定时任务'],
    },
    en: {
      name: 'Cron Explainer',
      tagline: 'Parse cron expressions: next run times and a plain-language description',
      description:
        'Parses standard 5-field and 6-field cron expressions, prints the next N run times and a plain-language summary (e.g. "every day at 03:00"). Timezone can be specified, so you can confirm the schedule before configuring a job.',
      capabilities: [
        '5-field and 6-field cron parsing',
        'Next N execution times',
        'Plain-language schedule description',
        'Timezone support',
      ],
      scenarios: ['Scheduled jobs'],
    },
  },
];

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}
