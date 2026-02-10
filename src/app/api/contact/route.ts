import { NextResponse } from 'next/server';
import 'server-only';

// 定义Contact类型接口
interface ContactData {
  name: string;
  contact: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    // 解析请求体数据
    const data: ContactData = await request.json();

    // 验证必要字段
    if (!data.name || !data.contact) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 处理联系表单数据
    // TODO: 实现数据存储逻辑
    return NextResponse.json({ message: '联系表单提交成功' }, { status: 200 });
  } catch (error) {
    console.error('处理联系表单时出错:', error);
    return NextResponse.json({ error: '处理联系表单时出错' }, { status: 500 });
  }
}