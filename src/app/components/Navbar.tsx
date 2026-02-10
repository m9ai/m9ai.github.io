'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/navigation';
import { routing } from '@/i18n/routing';
import { useTheme } from '@/app/contexts/ThemeContext';
import SearchButton from './SearchButton';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { href: '/', label: 'navbar.menu.home' },
  { href: '/services', label: 'navbar.menu.services' },
  { href: '/store', label: 'navbar.menu.store' },
  { href: '/docs', label: 'navbar.menu.docs' },
  { href: '/contact', label: 'navbar.menu.contact' },
];

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsLangDropdownOpen(false);
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLocale = (newLocale: string) => {
    // 移除当前的 locale 前缀，然后添加新的 locale
    const pathnameWithoutLocale = pathname.replace(new RegExp(`^/(${routing.locales.join('|')})`), '');
    const newPath = `/${newLocale}${pathnameWithoutLocale || '/'}`;
    window.location.href = newPath;
    setIsLangDropdownOpen(false);
  };
  
  // 确保当前语言显示正确
  const currentLocale = locale || 'zh';

  const themeIcons = {
    light: <SunIcon className="w-4 h-4" />,
    dark: <MoonIcon className="w-4 h-4" />,
    system: <ComputerDesktopIcon className="w-4 h-4" />,
  };

  const themeLabels = {
    light: t('theme.light') || 'Light',
    dark: t('theme.dark') || 'Dark',
    system: t('theme.system') || 'System',
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-soft' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-card group-hover:shadow-glow transition-shadow duration-300">
              <Image 
                src="/favicon.jpg" 
                alt="Logo" 
                fill 
                className="object-cover"
                draggable={false}
              />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">
              {t('navbar.logo')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t(item.label)}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Search, Theme, Language, Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <SearchButton />

            {/* Theme Toggle Dropdown */}
            <div className="relative dropdown-container hidden sm:block">
              <button
                onClick={() => {
                  setIsThemeDropdownOpen(!isThemeDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                {resolvedTheme === 'dark' ? themeIcons.dark : themeIcons.light}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isThemeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-border"
                  >
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTheme(t);
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          theme === t 
                            ? 'text-primary bg-primary/5' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {themeIcons[t]}
                        {themeLabels[t]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher */}
            <div className="relative dropdown-container hidden sm:block">
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsThemeDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <span className="uppercase font-semibold text-xs">{currentLocale}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-32 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-border"
                  >
                    {routing.locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => changeLocale(loc)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          currentLocale === loc 
                            ? 'text-primary bg-primary/5' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="uppercase font-semibold text-xs w-5">{loc}</span>
                        <span>{loc === 'zh' ? '中文' : 'English'}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-all hover:shadow-glow btn-shine"
            >
              {t('navbar.cta') || 'Get Started'}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t(item.label)}
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Mobile Theme Toggle */}
              <div className="pt-4 border-t border-border mt-4">
                <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  {t('theme.title') || 'Theme'}
                </p>
                <div className="flex gap-2 px-4">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === t 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {themeIcons[t]}
                      <span className="capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Language Switcher */}
              <div className="pt-4">
                <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  {t('navbar.language')}
                </p>
                <div className="flex gap-2 px-4">
                  {routing.locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => changeLocale(loc)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        locale === loc 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="uppercase font-semibold">{loc}</span>
                      <span>{loc === 'zh' ? '中文' : 'English'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
