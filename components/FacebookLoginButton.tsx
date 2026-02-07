// components/FacebookLoginButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { initFacebookSdk, fbLogin, getLoginStatus, fbLogout } from '@/lib/facebook-sdk';

export default function FacebookLoginButton() {
  const [status, setStatus] = useState<'loading' | LoginStatus>('loading');
  const [userName, setUserName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    initFacebookSdk()
      .then(() => getLoginStatus())
      .then((response) => {
        setStatus(response.status);

        if (response.status === 'connected' && response.authResponse) {
          window.FB.api('/me', { fields: 'name,email' }, (me: any) => {
            if (me && me.name) {
              setUserName(me.name);
            }
          });
        }
      })
      .catch((err) => {
        console.error('SDK init failed:', err);
        setStatus('unknown');
      });
  }, []);

  const handleLogin = async () => {
    setErrorMessage(null);
    try {
      const response = await fbLogin('public_profile,email');
      setStatus(response.status);

      if (response.status === 'connected') {
        window.FB.api('/me', { fields: 'name,email' }, (me: any) => {
          if (me && me.name) {
            setUserName(me.name);
            console.log('Logged in user data:', me);
            // Here you can: send accessToken to your backend, set cookie, redirect, etc.
          }
        });
      }
    } catch (err: any) {
      console.warn('Facebook login issue:', err.message);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fbLogout();
      setStatus('unknown');
      setUserName(null);
      setErrorMessage(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (status === 'loading') {
    return <div>Loading Facebook integration...</div>;
  }

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      {status === 'connected' ? (
        <div>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Welcome back, <strong>{userName || 'Facebook User'}</strong>!
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: '#e74c3c',
              color: 'white',
              padding: '12px 28px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Log out from Facebook
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleLogin}
            style={{
              background: '#1877f2',
              color: 'white',
              padding: '14px 32px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '17px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Continue with Facebook
          </button>

          {errorMessage && (
            <p style={{ color: '#c0392b', marginTop: '1rem', fontWeight: '500' }}>
              {errorMessage}
            </p>
          )}

          <p style={{ marginTop: '1.5rem', color: '#555', fontSize: '0.95rem' }}>
            Status: <strong>{status}</strong>
          </p>
        </>
      )}
    </div>
  );
}