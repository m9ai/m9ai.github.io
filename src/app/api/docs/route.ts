import { NextResponse } from 'next/server';
import AV from '@/app/lib/leancloud';

export const dynamic = 'force-static';

// 获取文档列表或单个文档内容
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const query = new AV.Query('Document');
    
    if (id) {
      const doc = await query.get(id);
      return NextResponse.json(doc.toJSON());
    } else {
      const docs = await query.find();
      return NextResponse.json(docs.map(doc => doc.toJSON()));
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}