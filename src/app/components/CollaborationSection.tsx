'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  PaperAirplaneIcon,
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import { Link } from '@/lib/navigation';

interface FormData {
  name: string;
  contact: string;
  message: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
  isTextarea?: boolean;
}

function FormField({ label, name, type = 'text', value, onChange, placeholder, icon, required, isTextarea }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={4}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}

export default function CollaborationSection() {
  const t = useTranslations('collaboration');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Submit failed');
      }

      setIsSuccess(true);
      setFormData({ name: '', contact: '', message: '' });
      toast.success(t('toast.success'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submit failed, please try again later';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden"
    >
      <Toaster position="top-right" />
      
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            {t('sectionTag') || 'Get In Touch'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('sectionTitle')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('sectionDescription')}
          </p>
        </motion.div>

        {/* Content grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form section */}
            <div className="lg:col-span-3">
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
                      {t('submitSuccess.title')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      {t('submitSuccess.message')}
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 text-primary font-medium hover:underline"
                    >
                      {t('sendAnother') || 'Send another message'}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField
                      label={t('form.nameLabel')}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                      icon={<UserIcon className="w-5 h-5" />}
                      required
                    />
                    
                    <FormField
                      label={t('form.contactLabel')}
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder={t('form.contactPlaceholder')}
                      icon={<EnvelopeIcon className="w-5 h-5" />}
                      required
                    />
                    
                    <FormField
                      label={t('form.messageLabel')}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('form.messagePlaceholder')}
                      icon={<ChatBubbleLeftIcon className="w-5 h-5" />}
                      isTextarea
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-600 text-white font-semibold rounded-xl transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed btn-shine"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('form.submitting') || 'Submitting...'}
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5" />
                          {t('form.submitButton')}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact info section */}
            <div className="lg:col-span-2 space-y-6">
              {/* WeChat QR Code */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-soft border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <QrCodeIcon className="w-5 h-5 text-primary" />
                  {t('contact.wechat')}
                </h3>
                <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <Image
                    src="/wechatqrcode.jpg"
                    alt="WeChat QR Code"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  {t('contact.scanQR') || 'Scan to add on WeChat'}
                </p>
              </div>

              {/* Email contact */}
              <Link
                href="mailto:c@m9ai.work"
                className="block bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-3xl p-6 border border-primary/10 dark:border-primary/20 hover:border-primary/30 transition-all group"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-primary" />
                  {t('contact.email')}
                </h3>
                <p className="text-primary font-medium group-hover:underline">
                  c@m9ai.work
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {t('contact.responseTime')}
                </p>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
