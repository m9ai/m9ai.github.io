/**
 * 本项目的 Tailwind 版本是 v4，走 CSS-first 配置：
 * 所有颜色 / 字体 / 阴影 / 动画令牌都定义在 src/app/globals.css 的 `@theme inline` 里，
 * 本文件**不再承载任何主题**（v4 默认不读取 tailwind.config.js，除非 CSS 里写 `@config`）。
 *
 * 历史说明：改版前主题写在这里（indigo/violet/rose 紫粉系 + 若干 animation/boxShadow），
 * 但因为 v4 不读它，tailwind.config.js 早已是死配置 —— 产物 CSS 里查不到
 * `animate-pulse-slow`、`shadow-elevated`、`shadow-soft` 等类名，等于整站多处样式静默失效。
 * 已把这些令牌迁回 CSS。此文件仅保留 content 供编辑器/第三方工具做类名扫描。
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector',
  theme: {},
  plugins: [],
};
