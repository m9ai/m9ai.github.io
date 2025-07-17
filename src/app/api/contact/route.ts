import { NextResponse } from 'next/server';
import AV from '@/app/lib/leancloud';
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

    // 创建LeanCloud Contact对象
    const Contact = AV.Object.extend('Contact');
    const contact = new Contact();

    // 设置对象属性
    contact.set('name', data.name);
    contact.set('contact', data.contact);
    contact.set('message', data.message);

    // 保存到LeanCloud
    const result = await contact.save();
    console.log('result %0', result.toJSON());
    return NextResponse.json({
      success: true,
      message: '提交成功'
    }, { status: 201 });

  } catch (error) {
    console.error('提交表单时出错:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}