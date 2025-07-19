export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  features?: string[];
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  details: string;
  coreAdvantages: ServiceFeature[];
  scenarios: ServiceFeature[];
  technicalFeatures: ServiceFeature[];
  cases: { title: string; description: string }[];
}

export const services: Service[] = [
  {
  id: 'model-deployment',
  title: '大模型私有化部署 —— 数据安全可控的本地化AI基建',
  description: '聚焦企业数据安全需求，提供从模型选型到本地化部署的全流程解决方案，支持自定义微调与性能优化',
  imageUrl: '/bushu.jpg',
  category: 'AI服务',
  details: '提供主流大模型的本地化部署方案，保障数据安全与隐私，支持自定义微调与性能优化。我们的解决方案包括模型选型、环境配置、性能调优和持续维护，帮助企业在自有基础设施上安全高效地运行AI模型。',
  coreAdvantages: [
    { title: '支持主流大模型全覆盖', description: '包含GPT系列、LLaMA、文心一言、讯飞星火等10+主流大模型的本地化适配' },
    { title: '数据全链路安全', description: '部署在企业自有服务器/私有云，数据采集、训练、推理全流程不泄露，符合《数据安全法》《个人信息保护法》等合规要求' },
    { title: '深度定制能力', description: '支持基于企业私有数据的微调训练（如行业术语库、业务规则嵌入），模型效果贴合具体场景' },
    { title: '性能动态优化', description: '适配不同硬件环境（CPU/GPU/算力集群），通过量化压缩、推理加速技术降低资源占用，保障高并发场景稳定运行' }
  ],
  scenarios: [
    { title: '对数据敏感的行业', description: '金融（客户信息处理）、医疗（病历分析）、政务（涉密数据处理）、制造业（核心工艺参数优化）' },
    { title: '需本地化响应的场景', description: '企业内部知识库问答、生产系统实时决策支持（如工厂设备故障诊断）' }
  ],
  technicalFeatures: [
    { title: '全栈部署工具链', description: '包含模型压缩工具、环境配置脚本、监控仪表盘，降低部署门槛' },
    { title: '混合部署模式', description: '可结合公有云与私有服务器，实现“核心数据本地化+非敏感计算云端协同”' }
  ],
  cases: [
    { title: '某regional银行信贷审核系统', description: '部署私有化大模型后，实现客户信贷资料自动审核，数据留存本地且审核效率提升60%，合规风险降低90%' }
  ]
},
  {
    id: 'model-application',
    title: '大模型应用开发 —— 快速落地的企业级智能工具搭建',
    description: '基于大模型API构建各类智能应用，包括聊天机器人、内容生成工具、智能分析系统等，平均3-4周即可上线初代产品',
    imageUrl: '/app.jpg',
    category: 'AI服务',
    details: '基于大模型API构建各类智能应用，包括聊天机器人、内容生成工具、智能分析系统等。我们专注于将大模型能力与业务场景深度融合，开发实用、高效的AI应用解决方案。提供标准化SDK、可视化开发平台和全流程技术支持，帮助企业快速实现AI赋能。',
    coreAdvantages: [
      { title: '多模态API集成能力', description: '支持文本（对话/分析）、图像（识别/生成）、语音（转写/合成）等多模态功能，满足复杂场景需求' },
      { title: '低代码开发支持', description: '提供标准化SDK（Python/Java）、可视化开发平台，企业技术团队可快速上手，缩短开发周期（平均3-4周即可上线初代产品）' },
      { title: '深度业务融合', description: '不仅提供技术开发，还可结合行业经验设计应用逻辑（如客服机器人的话术规则、内容生成工具的风格定制）' }
    ],
    scenarios: [
      { title: '智能交互类', description: '电商智能客服（自动回复咨询+订单查询）、企业内部智能助手（员工手册问答+流程指引）' },
      { title: '内容生产类', description: '教育行业的课件自动生成、营销行业的文案/海报批量创作、媒体行业的新闻摘要撰写' },
      { title: '数据智能类', description: '企业销售数据自动分析报告、用户反馈情感倾向识别、供应链异常数据预警' }
    ],
    technicalFeatures: [
      { title: 'API权限精细化管理', description: '可按功能模块（如“文本生成”“数据分析”）分配调用权限，降低误操作风险' },
      { title: '应用监控后台', description: '实时查看调用量、响应速度、错误率等指标，便于优化迭代' }
    ],
    cases: [
      { title: '某教育培训机构智能课件生成工具', description: '通过大模型API自动将课程大纲转化为图文课件，同时支持老师手动微调，内容生产效率提升70%' }
    ]
  },
  {
    id: 'agent-development',
    title: '智能体开发 —— 具备自主决策能力的AI协作伙伴',
    description: '开发具备自主决策能力的AI智能体，支持多工具集成、任务规划与长期记忆管理，打造企业专属AI协作伙伴',
    imageUrl: '/agent.jpg',
    category: 'AI服务',
    details: '开发具备自主决策能力的AI智能体，支持多工具集成、任务规划与长期记忆管理。我们的智能体解决方案能够理解复杂指令，规划执行步骤，并通过多工具协作完成复杂任务，成为企业高效的AI协作伙伴。',
    coreAdvantages: [
      { title: '自主任务规划', description: '基于目标拆解算法，将复杂任务分解为可执行步骤，并动态调整策略（如遇客户未回复，自动触发二次跟进计划）' },
      { title: '多工具集成生态', description: '可无缝对接企业现有系统（CRM、OA、邮件系统、数据库等），无需人工介入即可完成跨平台操作' },
      { title: '长期记忆管理', description: '具备“短期任务记忆”（记录当前流程进度）和“长期知识沉淀”（积累成功案例经验，持续优化决策逻辑）' }
    ],
    scenarios: [
      { title: '自动化办公', description: '企业行政智能体（自动排班、会议纪要生成、报销流程审核）、销售智能体（客户跟进提醒、报价单生成、成交概率预测）' },
      { title: '复杂流程处理', description: '供应链智能体（库存预警→自动对接供应商→生成采购计划）、科研辅助智能体（文献检索→实验数据整理→结论初步分析）' }
    ],
    technicalFeatures: [
      { title: '“目标-手段”决策框架', description: '结合强化学习与规则引擎，平衡灵活性与可靠性' },
      { title: '人机协作模式', description: '当智能体遇到超出权限或复杂异常时，自动触发人工介入提醒，避免决策失误' }
    ],
    cases: [
      { title: '某跨境电商全链路运营智能体', description: '自动完成“市场趋势分析→选品建议→Listing生成→库存监控→差评自动回复”全流程，运营团队人力成本降低40%，爆款孵化周期缩短30%' }
    ]
  }
];