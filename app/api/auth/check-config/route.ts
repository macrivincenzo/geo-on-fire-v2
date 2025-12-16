import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'NOT SET',
    currentUrl: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'NOT ON VERCEL',
    vercelUrl: process.env.VERCEL_URL || 'NOT SET',
  };

  // Check if URLs match
  const urlMismatch = config.appUrl !== 'NOT SET' && 
                      config.currentUrl !== 'NOT ON VERCEL' &&
                      !config.currentUrl.includes(config.appUrl) &&
                      !config.appUrl.includes(config.currentUrl);

  return NextResponse.json({
    ...config,
    urlMismatch,
    recommendation: urlMismatch 
      ? `⚠️ NEXT_PUBLIC_APP_URL (${config.appUrl}) doesn't match deployment URL (${config.currentUrl}). Update NEXT_PUBLIC_APP_URL in Vercel to match your deployment URL.`
      : '✅ Configuration looks good',
  });
}

