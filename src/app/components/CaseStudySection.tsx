'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslations } from 'next-intl';

// 案例数据类型定义
interface CaseStudy {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

// 示例案例数据
// 移除硬编码数据
// const caseStudies: CaseStudy[] = [ ... ]

// 使用翻译键动态获取案例数据
const caseStudies = [0, 1, 2, 3].map((idx) => ({
  id: idx + 1,
  title: `studies.${idx}.title`,
  description: `studies.${idx}.description`,
  imageUrl: [`/kefu.jpg`, `/yiliao.jpg`, `/jinrong.jpg`, `/jiaoyu.jpg`][idx],
  category: `studies.${idx}.category`
}));

// 轮播配置
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1
      }
    }
  ]
};

export default function CaseStudySection() {
  const t = useTranslations('cases');
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{t('sectionTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('sectionDescription')}
          </p>
        </div>

        <div className="mt-10">
          <Slider {...sliderSettings}>
            {caseStudies.map((study, idx) => (
              <div key={idx} className="px-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center p-4 bg-cover" style={{backgroundImage: `url(${study.imageUrl})`}} />
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold mb-3 w-fit">
                      {t(`studies.${idx}.category`)}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t(`studies.${idx}.title`)}</h3>
                    <p className="text-slate-600 dark:text-slate-300 flex-grow">{t(`studies.${idx}.description`)}</p>
                    <button className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      {t('viewDetails')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}