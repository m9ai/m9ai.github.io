'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';
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

const businessTypes = [
  { value: '', label: '请选择业务类型' },
  { value: 'customer-service', label: '智能客服' },
  { value: 'content-generation', label: '内容生成' },
  { value: 'data-analysis', label: '数据分析' },
  { value: 'process-automation', label: '流程自动化' },
  { value: 'knowledge-base', label: '知识库搭建' },
  { value: 'other', label: '其他场景' },
];

const faqs = [
  {
    question: '免费顾问服务包含哪些内容？',
    answer: '我们的免费顾问服务包括：1）业务场景AI化可行性分析；2）技术方案建议书；3）投资回报率预估；4）实施路径规划。整个过程大约需要30-45分钟的深度沟通。'
  },
  {
    question: '咨询后是否必须购买服务？',
    answer: ' absolutely not。免费咨询无任何附加条件，您可以完全基于自身需求决定是否合作。我们的目标是帮助您理清AI应用思路，即使最终不选择我们，也希望对您有所帮助。'
  },
  {
    question: '顾问的专业背景如何？',
    answer: '我们的顾问团队均来自知名科技企业，拥有5年以上AI项目落地经验，服务过金融、医疗、制造、零售等多个行业，累计帮助100+企业完成AI转型。'
  },
  {
    question: '多久可以收到回复？',
    answer: '提交表单后，我们会在2个工作小时内与您取得联系，安排顾问对接。紧急需求可备注说明，我们将优先处理。'
  },
];

const processSteps = [
  {
    icon: ClockIcon,
    title: '提交需求',
    description: '填写基本信息，2小时内响应',
    color: 'bg-blue-500',
  },
  {
    icon: LightBulbIcon,
    title: '深度沟通',
    description: '30分钟专业顾问1对1咨询',
    color: 'bg-purple-500',
  },
  {
    icon: ShieldCheckIcon,
    title: '方案输出',
    description: '3个工作日内提供定制方案',
    color: 'bg-green-500',
  },
  {
    icon: PaperAirplaneIcon,
    title: '自主决策',
    description: '零压力，您决定是否合作',
    color: 'bg-orange-500',
  },
];

export default function FreeConsultation() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
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
      // 发送数据到后端 API
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submit failed');

      // 发送 Clarity 自定义事件追踪转化
      if (typeof window !== 'undefined' && window.clarity) {
        window.clarity('event', 'consultation_submitted', {
          business_type: formData.businessType,
          has_pain_point: formData.painPoint ? 'yes' : 'no',
        });
      }

      setIsSuccess(true);
      toast.success('预约成功！我们会尽快与您联系');
    } catch {
      toast.error('提交失败，请稍后重试');
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
            限时免费开放中
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            免费AI应用咨询顾问
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            还在为如何AI化业务而困惑？我们的专家团队为您提供30分钟免费咨询，
            <br className="hidden sm:block" />
            帮您梳理场景、评估可行性、规划实施路径
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
            { icon: ClockIcon, label: '2小时内响应', color: 'text-blue-600' },
            { icon: LightBulbIcon, label: '专业顾问1对1', color: 'text-purple-600' },
            { icon: ShieldCheckIcon, label: '0元免费咨询', color: 'text-green-600' },
            { icon: CheckCircleIcon, label: '无任何附加条件', color: 'text-orange-600' },
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
                    预约成功！
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                    我们的顾问将在2个工作小时内与您联系，请保持电话畅通
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({ name: '', company: '', phone: '', businessType: '', painPoint: '' });
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    继续预约其他咨询
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      立即预约免费咨询
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      填写以下信息，让我们的顾问更精准地为您服务
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          您的姓名 <span className="text-red-500">*</span>
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
                            placeholder="请输入姓名"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          公司名称 <span className="text-red-500">*</span>
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
                            placeholder="请输入公司名"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          联系电话 <span className="text-red-500">*</span>
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
                            placeholder="请输入手机号"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          业务类型 <span className="text-red-500">*</span>
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
                        目前遇到的痛点或需求
                      </label>
                      <div className="relative">
                        <ChatBubbleLeftIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <textarea
                          name="painPoint"
                          value={formData.painPoint}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                          placeholder="简单描述您的业务场景和希望解决的问题..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          提交中...
                        </>
                      ) : (
                        <>
                          立即预约免费咨询
                          <ArrowRightIcon className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                      提交即表示您同意我们的隐私政策，我们不会向第三方泄露您的信息
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
                服务流程
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
                常见问题
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white pr-4">
                        {faq.question}
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
                            {faq.answer}
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
              已服务 100+ 企业客户，涵盖金融、医疗、制造、零售等多个行业
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['某知名银行', '某三甲医院', '某大型制造企业', '某连锁零售品牌'].map((client, index) => (
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
