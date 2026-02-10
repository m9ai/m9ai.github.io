'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/app/contexts/ThemeContext';

interface CodeBlockProps {
  language: string;
  code: string;
}

// 自定义语法高亮样式
const customOneDark = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#1e293b', // slate-800
    margin: 0,
    padding: '1.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.7',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
};

const customOneLight = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    background: '#f8fafc', // slate-50
    margin: 0,
    padding: '1.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.7',
  },
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
};

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`relative group my-6 rounded-xl overflow-hidden border ${
      isDark 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-slate-50 border-slate-200'
    }`}>
      {/* 代码块头部 */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDark 
          ? 'bg-slate-900/50 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <span className={`text-xs uppercase font-semibold tracking-wider ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            copied
              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
              : isDark
                ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
          }`}
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="w-3.5 h-3.5" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* 代码内容 */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={isDark ? customOneDark : customOneLight}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.7',
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5rem',
            paddingRight: '1rem',
            color: isDark ? '#64748b' : '#94a3b8',
            fontSize: '0.75rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
