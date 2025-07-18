'use client';
import Image from 'next/image';
import React from 'react';

// 合作伙伴数据类型定义
interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
}

// 示例合作伙伴数据
const partners: Partner[] = [
  {
    id: 1,
    name: '科技联盟',
    logoUrl: '/globe.svg',
    description: '全球领先的AI技术研究机构'
  },
  {
    id: 2,
    name: '未来数据',
    logoUrl: '/file.svg',
    description: '企业级数据解决方案提供商'
  },
  {
    id: 3,
    name: '智能云',
    logoUrl: '/next.svg',
    description: '云计算服务领导者'
  },
  {
    id: 4,
    name: '数字未来',
    logoUrl: '/window.svg',
    description: '数字化转型咨询公司'
  }
];

export default function PartnersSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">合作伙伴</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            与行业领先企业携手，共同推动AI技术创新与落地应用
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Image
                  width={64}
                  height={64}
                  draggable={false}
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{partner.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}