'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { searchDocs, DocData } from '@/app/lib/docs';

const navItems = [
  { label: '介绍', path: '/docs' },
  { label: '安装', path: '/docs/installation' },
  { label: '使用指南', path: '/docs/usage' },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  // const [results, setResults] = useState<DocData[]>([]);


  return (
    <div className="flex min-h-screen">
      {/* 侧边导航 */}
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h1 className="text-xl font-bold mb-6">文档中心</h1>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  href={item.path}
                  className={`block px-3 py-2 rounded ${pathname === item.path ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            placeholder="搜索文档..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {children}
      </main>
    </div>
  );
}