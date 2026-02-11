import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  console.log('Received code:', code);

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: '0b326f43-29e3-4d0c-b250-c83607cb3b3f',
        client_secret: 'be736646-02a5-4d0f-b767-7882a414ca5a',
        redirect_uri: 'http://localhost:3000/api/hubspot/integrations',
        code,
      }).toString(), // ← small improvement: .toString()
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      console.error('HubSpot token exchange failed:', err);
      return NextResponse.json({ error: 'Token exchange failed', details: err }, { status: 500 });
    }

    const tokens = await tokenResponse.json();

    // Create response with cookies
    const response = new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>HubSpot Connected</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #f9fafb;
            color: #111827;
          }
          .card {
            background: white;
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 420px;
          }
          h1 { color: #027a4d; margin-bottom: 1rem; }
          p { margin-bottom: 1.5rem; color: #4b5563; }
          .btn {
            background: #027a4d;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
          }
          .btn:hover { background: #01633f; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>✓ HubSpot Connected!</h1>
          <p>Your HubSpot account is now successfully linked to the application.</p>
          <p>Redirecting to integrations page in 3 seconds...</p>
          <a href="/integrations?tab=crm" class="btn">Go to Integrations Now</a>
        </div>

        <script>
          setTimeout(() => {
            window.location.href = "/integrations?tab=crm";
          }, 3000);
        </script>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

    // Attach cookies to the response
    response.cookies.set('hubspot_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 21600,
      path: '/',
    });

    if (tokens.refresh_token) {
      response.cookies.set('hubspot_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return response;

  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}