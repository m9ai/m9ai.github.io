'use client';

import { useState } from 'react';
import { Theme } from '../contexts/ThemeContext';
import { Language } from '../contexts/LanguageContext';

interface SettingsButtonProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function SettingsButton({ theme, setTheme, language, setLanguage }: SettingsButtonProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className='ml-6 relative group'>
      {/* 设置图标按钮 */}
      <button
        className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative z-10'
        onClick={() => setSettingsOpen(!settingsOpen)}
        aria-label='打开设置菜单'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 15l-2 5L9 9l11-2 2 5-5 2z'></path>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
        </svg>
      </button>

      {/* 背景遮罩 */}
      {settingsOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden'
          onClick={() => setSettingsOpen(false)}
        ></div>
      )}

      {/* 抽屉弹层 */}
      <div
        className={`absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 transform transition-transform duration-300 ease-in-out ${settingsOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto`}
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='font-medium text-gray-900 dark:text-white'>设置</h3>
        </div>
        <div className='p-4 space-y-4'>
          {/* 主题设置 */}
          <div>
            <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>主题</h4>
            <div className='space-y-1'>
              <button
                onClick={() => setTheme('light')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${theme === 'light' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                明亮
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${theme === 'dark' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                暗黑
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${theme === 'system' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                跟随系统
              </button>
            </div>
          </div>

          {/* 语言设置 */}
          <div>
            <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>语言</h4>
            <div className='space-y-1'>
              <button
                onClick={() => setLanguage('zh-CN')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${language === 'zh-CN' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                简体中文
              </button>
              <button
                onClick={() => setLanguage('en-US')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${language === 'en-US' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ja-JP')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${language === 'ja-JP' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                日本語
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}