'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

// 表单数据类型定义
interface FormData {
  name: string;
  contact: string;
  message: string;
}

export default function CollaborationSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || '提交失败');
      }

      setSubmitSuccess(true);
      setFormData({ name: '', contact: '', message: '' });
      toast.success('提交成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提交失败，请稍后重试';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">一键合作</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            填写表单或通过以下方式与我们取得联系，我们将尽快与您沟通
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* 表单区域 - 简约现代风格 */}
            <div className="p-8 md:p-10">
              {submitSuccess ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">提交成功！</h3>
                  <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    感谢您的咨询，我们的服务顾问将在1-2个工作日内与您联系
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      称呼
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-transparent border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all outline-none"
                      placeholder="请输入您的称呼"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      联系方式
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-transparent border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all outline-none"
                      placeholder="电话或邮箱"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      备注
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-transparent rounded-lg text-slate-900 dark:text-white focus:border-primary focus:ring-0 transition-all outline-none resize-none"
                      placeholder="请简要描述您的需求"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>提交中...</>
                    ) : (
                      <>提交合作申请</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* 服务顾问直达 - 简约卡片风格 */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-8 md:p-10 flex flex-col justify-center">
              
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      <Image
                        src="/wechatqrcode.jpg"
                        alt="服务顾问微信二维码"
                        width={120}
                        height={120}
                        className="object-contain"
                        draggable={false}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>扫码加微信</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <a href="mailto:c@m9ai.work" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">发送邮件</p>
                      <p className="font-medium text-slate-900 dark:text-white">c@m9ai.work</p>
                    </div>
                  </a>
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <p>我们将在1-2个工作日内回复您</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}