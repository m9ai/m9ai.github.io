'use client';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// 案例数据类型定义
interface CaseStudy {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

// 示例案例数据
const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: '智能客服系统',
    description: '基于大语言模型的智能客服解决方案，提升客户满意度30%',
    imageUrl: '/kefu.jpg',
    category: '企业服务'
  },
  {
    id: 2,
    title: '医疗数据分析平台',
    description: '利用AI技术分析医疗数据，辅助医生诊断决策',
    imageUrl: '/yiliao.jpg',
    category: '医疗健康'
  },
  {
    id: 3,
    title: '金融风控系统',
    description: '实时监控交易风险，识别异常行为准确率达98%',
    imageUrl: '/jinrong.jpg',
    category: '金融科技'
  },
  {
    id: 4,
    title: '教育内容生成工具',
    description: '自动生成个性化学习内容，适配不同学习风格',
    imageUrl: '/jiaoyu.jpg',
    category: '在线教育'
  }
];

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
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">案例实践</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            探索我们利用大模型技术成功落地的项目案例，见证AI如何赋能各行各业
          </p>
        </div>

        <div className="mt-10">
          <Slider {...sliderSettings}>
            {caseStudies.map((study) => (
              <div key={study.id} className="px-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center p-4 bg-cover" style={{backgroundImage: `url(${study.imageUrl})`}} />
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold mb-3 w-fit">
                      {study.category}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{study.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 flex-grow">{study.description}</p>
                    <button className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      查看详情 →
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