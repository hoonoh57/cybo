import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROJECT_ROOT = process.cwd();

// GET: 파일 읽기
export async function GET(request: NextRequest) {
  const filePath = request.nextUrl.searchParams.get('path');
  if (!filePath) {
    return NextResponse.json({ error: 'path required' }, { status: 400 });
  }

  try {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    // 보안: 프로젝트 루트 밖 접근 차단
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      return NextResponse.json({ error: 'access denied' }, { status: 403 });
    }
    const content = await fs.readFile(fullPath, 'utf-8');
    const stat = await fs.stat(fullPath);
    return NextResponse.json({
      content,
      size: stat.size,
      modified: stat.mtime.toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

// POST: 파일 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: filePath, content } = body;
    if (!filePath || content === undefined) {
      return NextResponse.json({ error: 'path and content required' }, { status: 400 });
    }

    const fullPath = path.join(PROJECT_ROOT, filePath);
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      return NextResponse.json({ error: 'access denied' }, { status: 403 });
    }

    // 디렉토리가 없으면 생성
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
    const stat = await fs.stat(fullPath);

    return NextResponse.json({
      saved: true,
      size: stat.size,
      modified: stat.mtime.toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT: 파일 생성 (새 파일)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: filePath, content = '' } = body;
    if (!filePath) {
      return NextResponse.json({ error: 'path required' }, { status: 400 });
    }

    const fullPath = path.join(PROJECT_ROOT, filePath);
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      return NextResponse.json({ error: 'access denied' }, { status: 403 });
    }

    // 이미 존재하면 에러
    try {
      await fs.access(fullPath);
      return NextResponse.json({ error: 'file already exists' }, { status: 409 });
    } catch {
      // 파일 없음 = 정상
    }

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');

    return NextResponse.json({ created: true, path: filePath });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
