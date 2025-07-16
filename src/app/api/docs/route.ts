import { NextResponse } from 'next/server';
export const dynamic = 'force-static';

// 模拟线上文档数据
const mockDocs = [
  {
    id: 'introduction',
    title: '介绍',
    content: '# 项目介绍\n\n这是一个通过API获取文档的示例项目。',
    path: '/docs/introduction'
  },
  {
    id: 'installation',
    title: '安装指南',
    content: '# 安装指南\n\n使用`pnpm install`安装依赖。',
    path: '/docs/installation'
  }
];

// 获取所有文档列表
export async function GET() {
  try {
    // 实际项目中这里应该是调用线上API获取文档数据
    // const res = await fetch('线上API地址', { next: { revalidate: 60 } });
    // const docs = await res.json();
    
    // 使用模拟数据
    return NextResponse.json(mockDocs);
  } catch (error) {
    console.error('获取文档失败:', error);
    return NextResponse.json(
      { error: '获取文档失败' },
      { status: 500 }
    );
  }
}

// 获取单个文档内容
export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    // 实际项目中这里应该是调用线上API获取单个文档
    const doc = mockDocs.find(item => item.id === id);
    
    if (!doc) {
      return NextResponse.json(
        { error: '文档不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(doc);
  } catch (error) {
    console.error('获取文档内容失败:', error);
    return NextResponse.json(
      { error: '获取文档内容失败' },
      { status: 500 }
    );
  }
}