'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

interface CommandLineProps {
  command: string;
  /** block 用于详情页正文；compact 用于卡片等空间受限处 */
  variant?: 'block' | 'compact';
}

/** 一条可一键复制的命令行。详情页与市集卡片共用，保证复制行为与文案一致。 */
export default function CommandLine({ command, variant = 'block' }: CommandLineProps) {
  const t = useTranslations('ui');
  const [copied, setCopied] = useState(false);
  const compact = variant === 'compact';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时静默失败：命令本身仍可选中复制
    }
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border transition-colors ${
        compact
          ? 'px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 group-hover:border-primary/40'
          : 'px-4 py-3 bg-slate-900 dark:bg-slate-950 border-slate-700'
      }`}
    >
      <span
        className={`select-none flex-shrink-0 ${compact ? 'text-xs text-slate-400' : 'text-slate-500'}`}
      >
        $
      </span>
      <code
        className={`flex-1 overflow-x-auto whitespace-nowrap ${
          compact ? 'text-xs text-slate-600 dark:text-slate-300' : 'text-sm text-slate-100'
        }`}
      >
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? t('copied') : t('copyCode')}
        title={command}
        className={`flex items-center gap-1.5 rounded-lg transition-colors flex-shrink-0 ${
          compact ? 'px-1.5 py-1' : 'px-2.5 py-1.5 text-xs font-medium'
        } ${
          copied
            ? 'text-green-600 dark:text-green-400 bg-green-500/10'
            : compact
              ? 'text-slate-400 hover:text-primary hover:bg-primary/10'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
        }`}
      >
        {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <ClipboardIcon className="w-3.5 h-3.5" />}
        {!compact && <span>{copied ? t('copied') : t('copyCode')}</span>}
      </button>
    </div>
  );
}
