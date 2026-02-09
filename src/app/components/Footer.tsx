'use client';

import Image from 'next/image';
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

// Social links
const socialLinks = [
  { 
    name: 'GitHub', 
    href: 'https://github.com/m9ai', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    name: 'Email', 
    href: 'mailto:c@m9ai.work', 
    icon: <EnvelopeIcon className="w-5 h-5" />
  },
];

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

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
