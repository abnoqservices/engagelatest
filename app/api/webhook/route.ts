import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = 'your-secret-verify-token-123'; // set in Meta dashboard

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  if (
    searchParams.get('hub.mode') === 'subscribe' &&
    searchParams.get('hub.verify_token') === VERIFY_TOKEN
  ) {
    return new NextResponse(searchParams.get('hub.challenge') || '', { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));
    // Handle incoming messages, status updates, etc.
    // Save to DB, notify user, auto-reply, etc.
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}