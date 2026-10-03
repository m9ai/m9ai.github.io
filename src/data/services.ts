export interface ServiceFeature {
  titleKey: string;
  descriptionKey: string;
}

export interface Service {
  features?: string[];
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  category: string;
  detailsKey: string;
  coreAdvantages: ServiceFeature[];
  scenarios: ServiceFeature[];
  technicalFeatures: ServiceFeature[];
  cases: { titleKey: string; descriptionKey: string }[];
}

export const services: Service[] = [
  {
    id: 'model-deployment',
    title: 'model-deployment.title',
    description: 'model-deployment.description',
    imageUrl: '/bushu.svg',
    category: 'aiService',
    detailsKey: 'model-deployment.details',
    coreAdvantages: [
      { titleKey: 'model-deployment.coreAdvantages.supportAllModels.title', descriptionKey: 'model-deployment.coreAdvantages.supportAllModels.description' },
      { titleKey: 'model-deployment.coreAdvantages.performanceOptimization.title', descriptionKey: 'model-deployment.coreAdvantages.performanceOptimization.description' },
      { titleKey: 'model-deployment.coreAdvantages.dataSecurity.title', descriptionKey: 'model-deployment.coreAdvantages.dataSecurity.description' },
      { titleKey: 'model-deployment.coreAdvantages.customization.title', descriptionKey: 'model-deployment.coreAdvantages.customization.description' }
    ],
    scenarios: [
      { titleKey: 'model-deployment.scenarios.dataSensitiveIndustries.title', descriptionKey: 'model-deployment.scenarios.dataSensitiveIndustries.description' },
      { titleKey: 'model-deployment.scenarios.airGapped.title', descriptionKey: 'model-deployment.scenarios.airGapped.description' }
    ],
    technicalFeatures: [
      { titleKey: 'model-deployment.technicalFeatures.toolchain.title', descriptionKey: 'model-deployment.technicalFeatures.toolchain.description' },
      { titleKey: 'model-deployment.technicalFeatures.elasticServing.title', descriptionKey: 'model-deployment.technicalFeatures.elasticServing.description' }
    ],
    cases: [
      { titleKey: 'model-deployment.cases.bank.title', descriptionKey: 'model-deployment.cases.bank.description' }
    ]
  },
  {
    id: 'model-application',
    title: 'model-application.title',
    description: 'model-application.description',
    imageUrl: '/app.svg',
    category: 'aiService',
    detailsKey: 'model-application.details',
    coreAdvantages: [
      { titleKey: 'model-application.coreAdvantages.multimodal.title', descriptionKey: 'model-application.coreAdvantages.multimodal.description' },
      { titleKey: 'model-application.coreAdvantages.businessIntegration.title', descriptionKey: 'model-application.coreAdvantages.businessIntegration.description' },
      { titleKey: 'model-application.coreAdvantages.lowCode.title', descriptionKey: 'model-application.coreAdvantages.lowCode.description' }
    ],
    scenarios: [
      { titleKey: 'model-application.scenarios.documentProcessing.title', descriptionKey: 'model-application.scenarios.documentProcessing.description' },
      { titleKey: 'model-application.scenarios.intelligentInteraction.title', descriptionKey: 'model-application.scenarios.intelligentInteraction.description' },
      { titleKey: 'model-application.scenarios.dataIntelligence.title', descriptionKey: 'model-application.scenarios.dataIntelligence.description' }
    ],
    technicalFeatures: [
      { titleKey: 'model-application.technicalFeatures.apiManagement.title', descriptionKey: 'model-application.technicalFeatures.apiManagement.description' },
      { titleKey: 'model-application.technicalFeatures.monitoring.title', descriptionKey: 'model-application.technicalFeatures.monitoring.description' }
    ],
    cases: [
      { titleKey: 'model-application.cases.education.title', descriptionKey: 'model-application.cases.education.description' }
    ]
  },
  {
    id: 'agent-development',
    title: 'agent-development.title',
    description: 'agent-development.description',
    imageUrl: '/agent.svg',
    category: 'aiService',
    detailsKey: 'agent-development.details',
    coreAdvantages: [
      { titleKey: 'agent-development.coreAdvantages.taskOrchestration.title', descriptionKey: 'agent-development.coreAdvantages.taskOrchestration.description' },
      { titleKey: 'agent-development.coreAdvantages.toolIntegration.title', descriptionKey: 'agent-development.coreAdvantages.toolIntegration.description' },
      { titleKey: 'agent-development.coreAdvantages.memoryManagement.title', descriptionKey: 'agent-development.coreAdvantages.memoryManagement.description' },
      { titleKey: 'agent-development.coreAdvantages.evaluation.title', descriptionKey: 'agent-development.coreAdvantages.evaluation.description' }
    ],
    scenarios: [
      { titleKey: 'agent-development.scenarios.businessAutomation.title', descriptionKey: 'agent-development.scenarios.businessAutomation.description' },
      { titleKey: 'agent-development.scenarios.complexProcess.title', descriptionKey: 'agent-development.scenarios.complexProcess.description' },
      { titleKey: 'agent-development.scenarios.researchAssistant.title', descriptionKey: 'agent-development.scenarios.researchAssistant.description' }
    ],
    technicalFeatures: [
      { titleKey: 'agent-development.technicalFeatures.observability.title', descriptionKey: 'agent-development.technicalFeatures.observability.description' },
      { titleKey: 'agent-development.technicalFeatures.humanInTheLoop.title', descriptionKey: 'agent-development.technicalFeatures.humanInTheLoop.description' }
    ],
    cases: [
      { titleKey: 'agent-development.cases.ecommerce.title', descriptionKey: 'agent-development.cases.ecommerce.description' }
    ]
  }
];