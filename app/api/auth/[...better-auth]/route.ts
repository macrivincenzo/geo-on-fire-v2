import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    return await auth.handler(request);
  } catch (error: any) {
    console.error('Auth GET error:', error);
    return NextResponse.json(
      { error: 'Authentication service error', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    return await auth.handler(request);
  } catch (error: any) {
    console.error('Auth POST error:', error);
    return NextResponse.json(
      { error: 'Authentication service error', message: error.message },
      { status: 500 }
    );
  }
}
