'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function EmbeddedSignupPage() {
  const [fbReady, setFbReady] = useState(false);
  const [status, setStatus] = useState('Loading Facebook SDK...');
  const [assets, setAssets] = useState<any>(null);
  const [sdkError, setSdkError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent duplicate loads
    if (document.getElementById('facebook-jssdk')) {
      initializeFB();
      return;
    }

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.body.appendChild(script);

    window.fbAsyncInit = initializeFB;

    // Fallback
    if (window.FB) initializeFB();

    // PostMessage listener for Embedded Signup events
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('facebook.com')) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('WA_EMBEDDED_SIGNUP event:', data);
          if (data.event === 'FINISH') {
            setAssets(data.data);
            setStatus('Onboarding complete! Assets: ' + JSON.stringify(data.data));
            if (data.data?.code) {
              exchangeCode(data.data.code, data.data.waba_id || '', data.data.phone_number_id || '');
            }
          } else if (data.event === 'CANCEL' || data.event === 'ERROR') {
            setStatus(`Signup ${data.event}: ${data.data?.error_message || 'Unknown issue'}`);
          }
        }
      } catch (err) {
        console.error('PostMessage parse error:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  function initializeFB() {
    if (!window.FB) {
      setStatus('Facebook SDK object missing');
      setSdkError('window.FB is undefined after load');
      return;
    }

    try {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: process.env.GRAPH_API_VERSION || 'v24.0',
      });
console.log('FB.init successful');
      // Debug: check if EmbeddedSignup exists
      if (!window.FB.EmbeddedSignup) {
        console.warn('FB.EmbeddedSignup is NOT available — check app config');
        setSdkError('EmbeddedSignup module not loaded. Verify Embedded Signup config in dashboard.');
        setStatus('SDK ready, but Embedded Signup unavailable');
      } else {
        setStatus('SDK + Embedded Signup ready. Click button.');
      }

      setFbReady(true);
    } catch (err: any) {
      console.error('FB.init failed:', err);
      setSdkError('FB.init error: ' + err.message);
      setStatus('SDK initialization failed');
    }
  }

  async function exchangeCode(code: string, wabaId: string, phoneId: string) {
    setStatus('Exchanging code for business token...');
    try {
      const result = await exchangeCodeForToken({ code, wabaId, phoneId });
      if (result.success) {
        setStatus(`Success! Token acquired. Phone ID: ${phoneId}`);
        setAssets((prev: any) => ({ ...prev, access_token: result.token }));
      } else {
        setStatus('Token exchange failed: ' + result.error);
      }
    } catch (err: any) {
      setStatus('Error: ' + err.message);
    }
  }

  function launchSignup() {
    if (!fbReady || !window.FB) {
      alert('Facebook SDK not ready');
      return;
    }

    if (!window.FB.EmbeddedSignup) {
      alert('EmbeddedSignup not available — check console & Meta dashboard config');
      setStatus('Cannot launch: EmbeddedSignup missing');
      console.error('Attempted launch but FB.EmbeddedSignup undefined');
      return;
    }

    try {
      window.FB.EmbeddedSignup.launch(
        {
          config_id: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
          response_type: 'code',
          override_default_response_type: true,
          extras: { setup: {} },
        },
        (response: any) => {
          console.log('launch callback:', response);
          if (response?.authResponse?.code) {
            exchangeCode(
              response.authResponse.code,
              assets?.waba_id || '',
              assets?.phone_number_id || ''
            );
          }
        }
      );
      setStatus('Embedded Signup popup launched...');
    } catch (err: any) {
      console.error('launch error:', err);
      setStatus('Launch failed: ' + err.message);
    }
  }

  // ... rest of your JSX remains almost the same, just add error display:
  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>WhatsApp Business Embedded Signup</h1>

      {sdkError && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          SDK Error: {sdkError} — Most likely: wrong config_id or Embedded Signup not enabled in app dashboard.
        </p>
      )}

      {/* ... button, status, assets display ... */}
    </main>
  );
}