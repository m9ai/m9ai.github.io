'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';
import { submitLead } from '@/lib/leads';
import { 
  PaperAirplaneIcon,
  CheckCircleIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

// Clarity window extension
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

interface ConsultFormData {
  name: string;
  company: string;
  phone: string;
  businessType: string;
  painPoint: string;
}

/* 业务类型：value 是要提交给后端的稳定枚举值，label 文案交给 i18n。
   此前这里直接写死中文，英文站会漏出一整排中文选项。 */
const businessTypeOptions = [
  { value: '', key: 'placeholder' },
  { value: 'customer-service', key: 'customerService' },
  { value: 'content-generation', key: 'contentGeneration' },
  { value: 'data-analysis', key: 'dataAnalysis' },
  { value: 'process-automation', key: 'processAutomation' },
  { value: 'knowledge-base', key: 'knowledgeBase' },
  { value: 'other', key: 'other' },
];

const faqs = [
  { questionKey: 'faq.q1', answerKey: 'faq.a1' },
  { questionKey: 'faq.q2', answerKey: 'faq.a2' },
  { questionKey: 'faq.q3', answerKey: 'faq.a3' },
  { questionKey: 'faq.q4', answerKey: 'faq.a4' },
];

/* 服务流程步骤同样只保留 key 与图标，文案取 consultation.process.* */
const processStepKeys = [
  { icon: ClockIcon, key: 'step1', color: 'bg-sky-600' },
  { icon: LightBulbIcon, key: 'step2', color: 'bg-slate-800' },
  { icon: ShieldCheckIcon, key: 'step3', color: 'bg-slate-700' },
  { icon: PaperAirplaneIcon, key: 'step4', color: 'bg-primary' },
];

export default function FreeConsultation() {
  const t = useTranslations('consultation');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const businessTypes = businessTypeOptions.map((option) => ({
    value: option.value,
    label: t(`form.businessTypeOptions.${option.key}`),
  }));

  const processSteps = processStepKeys.map((step) => ({
    ...step,
    title: t(`process.${step.key}.title`),
    description: t(`process.${step.key}.desc`),
  }));

  const [formData, setFormData] = useState<ConsultFormData>({
    name: '',
    company: '',
    phone: '',
    businessType: '',
    painPoint: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 提交到统一后端 m9ai-server
      await submitLead({
        source: 'consultation',
        name: formData.name,
        contact: formData.phone,
        company: formData.company,
        businessType: formData.businessType,
        message: formData.painPoint || undefined,
      });

      // 发送 Clarity 自定义事件追踪转化
      if (typeof window !== 'undefined' && window.clarity) {
        window.clarity('event', 'consultation_submitted', {
          business_type: formData.businessType,
          has_pain_point: formData.painPoint ? 'yes' : 'no',
        });
      }

      setIsSuccess(true);
      toast.success(t('success.toast'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('errors.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="free-consultation"
      className="relative py-24 lg:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden"
    >
      <Toaster position="top-center" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold mb-6"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {t('badge')}
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('sectionTitle')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('sectionDescription')}
          </p>
        </motion.div>

        {/* Value props */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
        >
          {[
            { icon: ClockIcon, label: t('valueProps.response'), color: 'text-primary' },
            { icon: LightBulbIcon, label: t('valueProps.expert'), color: 'text-sky-600' },
            { icon: ShieldCheckIcon, label: t('valueProps.free'), color: 'text-slate-700' },
            { icon: CheckCircleIcon, label: t('valueProps.noObligation'), color: 'text-slate-500' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              <item.icon className={`w-8 h-8 ${item.color} mb-2`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 shadow-soft border border-slate-200 dark:border-slate-700">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {t('success.title')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                    {t('success.message')}
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({ name: '', company: '', phone: '', businessType: '', painPoint: '' });
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    {t('success.bookAnother')}
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {t('form.title')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t('form.subtitle')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t('form.nameLabel')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder={t('form.namePlaceholder')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t('form.companyLabel')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <BuildingOfficeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder={t('form.companyPlaceholder')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t('form.phoneLabel')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder={t('form.phonePlaceholder')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t('form.businessTypeLabel')} <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                          {businessTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t('form.painPointLabel')}
                      </label>
                      <div className="relative">
                        <ChatBubbleLeftIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <textarea
                          name="painPoint"
                          value={formData.painPoint}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                          placeholder={t('form.painPointPlaceholder')}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-slate-900 hover:brightness-110 text-white font-semibold rounded-xl transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('form.submitting')}
                        </>
                      ) : (
                        <>
                          {t('form.submitButton')}
                          <ArrowRightIcon className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                      {t('form.privacyNotice')}
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Right: Process & FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Process */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-soft border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {t('process.title')}
              </h3>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-soft border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {t('faq.title')}
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white pr-4">
                        {t(faq.questionKey)}
                      </span>
                      {openFaq === index ? (
                        <ChevronUpIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400">
                            {t(faq.answerKey)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('trust.title')}，{t('trust.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {(t.raw('trust.clients') as string[]).map((client, index) => (
              <div key={index} className="text-slate-400 dark:text-slate-600 font-semibold">
                {client}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
