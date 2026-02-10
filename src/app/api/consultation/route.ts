import { NextResponse } from 'next/server';
import 'server-only';

// 定义Consultation类型接口
interface ConsultationData {
  name: string;
  company: string;
  phone: string;
  businessType: string;
  painPoint: string;
}

export async function POST(request: Request) {
  try {
    // 解析请求体数据
    const data: ConsultationData = await request.json();

    // 验证必要字段
    if (!data.name || !data.company || !data.phone || !data.businessType) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        { error: '请输入有效的手机号码' },
        { status: 400 }
      );
    }

    // 数据通过 Clarity 自定义事件追踪，API 端仅做验证
    // 实际数据会在前端通过 window.clarity('event', ...) 发送
    console.log('Consultation form validated:', {
      name: data.name,
      company: data.company,
      businessType: data.businessType,
    });

    return NextResponse.json({
      success: true,
      message: '预约成功'
    }, { status: 201 });

  } catch (error) {
    console.error('提交咨询表单时出错:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
