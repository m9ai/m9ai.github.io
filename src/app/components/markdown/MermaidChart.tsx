'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface MermaidChartProps {
  code: string;
}

export default function MermaidChart({ code }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { theme } = useTheme();

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        // 动态导入 mermaid（避免 SSR 问题）
        const mermaid = (await import('mermaid')).default;

        // 生成唯一 ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // 初始化 mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'strict',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          sequence: {
            useMaxWidth: true,
          },
          gantt: {
            useMaxWidth: true,
          },
        });

        // 渲染图表
        const { svg: renderedSvg } = await mermaid.render(id, code);
        setSvg(renderedSvg);
        setError('');
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('流程图渲染失败');
      }
    };

    renderChart();
  }, [code, theme]);

  if (error) {
    return (
      <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
        <p className="font-medium">流程图渲染失败</p>
        <pre className="mt-2 text-sm overflow-x-auto">{code}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
