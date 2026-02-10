'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

import { 
  HeartIcon,
  ArrowUpIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

// Footer links configuration
const footerLinks = {
  services: [
    { href: '/services/model-deployment', label: 'Model Deployment' },
    { href: '/services/model-application', label: 'App Development' },
    { href: '/services/agent-development', label: 'AI Agents' },
  ],
  company: [
    { href: '/contact', label: 'footer.contactUs' },
    { href: '/docs', label: 'navbar.menu.docs' },
    { href: '/store', label: 'navbar.menu.store' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'footer.privacyPolicy' },
    { href: '/terms-of-service', label: 'footer.termsOfService' },
  ],
};

// 微信图标
const WeChatIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 0 1-.011-.175.49.49 0 0 1 .189-.38C23.063 18.369 24 16.672 24 14.783c0-3.354-3.16-6.007-7.062-5.925zm-2.92 2.691c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
  </svg>
);

// 视频号图标
const VideoIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

// 微信二维码数据
const wechatLinks = [
  {
    name: '微信公众号',
    qrCode: '/logos/w-logo-qr.jpg',
    icon: <WeChatIcon />,
  },
  {
    name: '微信视频号',
    qrCode: '/logos/v-logo-qr.png',
    icon: <VideoIcon />,
  },
];

// Social links
const socialLinks = [
  { 
    name: 'Email', 
    href: 'mailto:c@m9ai.work', 
    icon: <EnvelopeIcon className="w-5 h-5" />
  },
];

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const [hoveredWechat, setHoveredWechat] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-900 dark:bg-black text-slate-300 overflow-hidden">
      {/* Top wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-glow transition-shadow">
                  <Image 
                    src="/favicon.jpg" 
                    alt="Logo" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-white">
                  {t('footer.logoText')}
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                {t('footer.description') || 'Enterprise-grade AI solutions for model deployment, application development, and intelligent agent customization.'}
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-3">
                {/* 微信图标组 */}
                {wechatLinks.map((wechat) => (
                  <div
                    key={wechat.name}
                    className="relative"
                    onMouseEnter={() => setHoveredWechat(wechat.name)}
                    onMouseLeave={() => setHoveredWechat(null)}
                    onTouchStart={() => setHoveredWechat(wechat.name)}
                  >
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all"
                      aria-label={wechat.name}
                    >
                      {wechat.icon}
                    </button>
                    {/* 二维码弹出层 */}
                    {hoveredWechat === wechat.name && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white rounded-xl shadow-xl z-50 animate-in fade-in zoom-in duration-200">
                        <div className="relative w-32 h-32 bg-slate-100 rounded-lg overflow-hidden">
                          <Image
                            src={wechat.qrCode}
                            alt={wechat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs text-slate-600 text-center mt-2 font-medium">{wechat.name}</p>
                        {/* 箭头 */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                          <div className="w-3 h-3 bg-white rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* 邮件图标 */}
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services column */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.services') || 'Services'}</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.company') || 'Company'}</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-primary transition-colors text-sm"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.legal') || 'Legal'}</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-primary transition-colors text-sm"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm flex items-center gap-1">
              © {currentYear} {t('footer.logoText')}. {t('footer.madeWith') || 'Made with'}
              <HeartIcon className="w-4 h-4 text-accent inline" />
              {t('footer.allRightsReserved') || 'All rights reserved.'}
            </p>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm group"
            >
              {t('footer.backToTop') || 'Back to top'}
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowUpIcon className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
