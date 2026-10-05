'use client';

import type { ReactNode } from 'react';
import { Link } from '@/lib/navigation';
import { motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  ChevronRightIcon,
  CommandLineIcon,
  LockClosedIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';
import type { Skill } from '@/data/skills';
import { cliInstallCommand, isInstallable, skillsReleasesUrl } from '@/data/skills';
import { categoryIcons } from '@/app/components/SkillCard';
import CommandLine from '@/app/components/CommandLine';

interface SkillDetailClientProps {
  skill: Skill;
}

export default function SkillDetailClient({ skill }: SkillDetailClientProps) {
  const t = useTranslations('Store');
  const locale = useLocale();
  const copy = locale === 'en' ? skill.en : skill.zh;
  const Icon = categoryIcons[skill.category];

  // 只有已发布且有技能包目录的条目才给出可执行的安装步骤
  const installable = isInstallable(skill);
  const cliCommand = cliInstallCommand(skill);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      {/* 顶部导航 */}
      <header className="fixed top-16 lg:top-20 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/store"
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{t('detail.backToList')}</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-primary transition-colors">
                {t('detail.home')}
              </Link>
              <ChevronRightIcon className="w-3 h-3" />
              <Link href="/store" className="hover:text-primary transition-colors">
                {t('detail.store')}
              </Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-slate-900 dark:text-white font-medium">{copy.name}</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-sky-600 to-slate-900 flex items-center justify-center flex-shrink-0">
                <Icon className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {t(`categories.${skill.category}`)}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm">
                    {t(`status.${skill.status}`)}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {copy.name}
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {copy.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="#install"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
                  >
                    <CommandLineIcon className="w-5 h-5" />
                    {t('detail.install.cta')}
                  </a>
                  {skill.repo && (
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl">
                      <code className="text-sm">{skill.repo}</code>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 交付状态说明：planned 的技能必须说清还没实现 */}
        {skill.status !== 'available' && (
          <div className="mb-12 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
            {t(`detail.statusNote.${skill.status}`)}
          </div>
        )}

        {/* 能力清单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {t('detail.capabilities')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copy.capabilities.map((capability, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{capability}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 规格：可验证的结构性信息，取代原先编造的评分与截图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {t('detail.specs')}
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            <SpecRow label={t('detail.spec.scenarios')}>
              <div className="flex flex-wrap gap-1.5">
                {copy.scenarios.map((scenario) => (
                  <span
                    key={scenario}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg"
                  >
                    {scenario}
                  </span>
                ))}
              </div>
            </SpecRow>

            <SpecRow label={t('detail.spec.roles')}>
              <div className="flex flex-wrap gap-1.5">
                {skill.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg"
                  >
                    {t(`roles.${role}`)}
                  </span>
                ))}
              </div>
            </SpecRow>

            <SpecRow label={t('detail.spec.runtime')}>{t(`runtime.${skill.runtime}`)}</SpecRow>

            <SpecRow label={t('detail.spec.offline')}>
              <span className="inline-flex items-center gap-1.5">
                <WifiIcon className="w-4 h-4 text-slate-400" />
                {t(`offline.${skill.offline}`)}
              </span>
            </SpecRow>

            <SpecRow label={t('detail.spec.privacy')}>
              <span className="inline-flex items-center gap-1.5">
                <LockClosedIcon className="w-4 h-4 text-slate-400" />
                {t('privacy.localOnly')}
              </span>
            </SpecRow>

            {skill.repo && (
              <SpecRow label={t('detail.spec.repo')}>
                <code className="text-sm">{skill.repo}</code>
              </SpecRow>
            )}
          </div>
        </motion.div>

        {/* 安装方式：可执行的步骤取代原先「申请试用」的留资动作 */}
        <motion.div
          id="install"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 scroll-mt-40"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('detail.install.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-3xl">
            {t('detail.install.description')}
          </p>

          {installable ? (
            <div className="space-y-4">
              {/* ① 导入技能包 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    ① {t('detail.install.package.label')}
                  </h3>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-lg">
                    {t('detail.install.recommended')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {t('detail.install.package.desc')}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={skillsReleasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-primary text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {t('detail.install.package.download')}
                  </a>
                  {skill.version && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {t('detail.install.version')} <code>v{skill.version}</code>
                    </span>
                  )}
                </div>
              </div>

              {/* ② 命令行安装 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                  ② {t('detail.install.cli.label')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {t('detail.install.cli.desc')}
                </p>
                <CommandLine command={cliCommand} />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {t('detail.install.cli.hint')}
                </p>
              </div>

              {/* ③ 手动解压 / 内网分发 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                  ③ {t('detail.install.manual.label')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {t('detail.install.manual.desc')}
                </p>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
                  <PathRow
                    name={t('detail.install.manual.paths.workbuddy')}
                    path={t('detail.install.manual.paths.workbuddyPath')}
                  />
                  <PathRow
                    name={t('detail.install.manual.paths.claudeUser')}
                    path={t('detail.install.manual.paths.claudeUserPath')}
                  />
                  <PathRow
                    name={t('detail.install.manual.paths.claudeProject')}
                    path={t('detail.install.manual.paths.claudeProjectPath')}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  {t('detail.install.manual.paths.otherNote')}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-6 text-sm text-slate-500 dark:text-slate-400">
              {t('detail.install.notReleased')}
            </div>
          )}
        </motion.div>

        {/* 相关服务引导 */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {t('detail.upsell.title')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('detail.upsell.description')}
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 hover:bg-primary text-white font-medium rounded-xl transition-colors flex-shrink-0"
          >
            {t('detail.upsell.cta')}
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PathRow({ name, path }: { name: string; path: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-4 py-3">
      <span className="text-sm text-slate-500 dark:text-slate-400 sm:w-56 flex-shrink-0">{name}</span>
      <code className="text-sm text-slate-800 dark:text-slate-200 break-all">{path}</code>
    </div>
  );
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4">
      <span className="text-sm text-slate-500 dark:text-slate-400 sm:w-32 flex-shrink-0">
        {label}
      </span>
      <div className="text-sm text-slate-800 dark:text-slate-200">{children}</div>
    </div>
  );
}
