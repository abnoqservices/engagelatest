// lib/facebook-sdk.ts
'use client';

type LoginStatus = 'connected' | 'not_authorized' | 'unknown';

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

interface FBResponse {
  status: LoginStatus;
  authResponse?: AuthResponse;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

let isInitialized = false;

export function initFacebookSdk(): Promise<void> {
  if (isInitialized) return Promise.resolve();

  return new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v24.0',   // ← use this if explicit version needed
        // or omit version → uses latest from Meta
      });

      // Optional — remove if not using analytics
      window.FB.AppEvents?.logPageView();

      isInitialized = true;
      resolve();
    };

    (function (d, s, id) {
      if (d.getElementById(id)) {
        resolve(); // already loading/loaded
        return;
      }
      const fjs = d.getElementsByTagName(s)[0];
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      js.onerror = () => reject(new Error('Failed to load Facebook SDK'));
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  });
}

export function getLoginStatus(): Promise<FBResponse> {
  return new Promise((resolve) => {
    if (!window.FB) {
      resolve({ status: 'unknown' });
      return;
    }
    window.FB.getLoginStatus((response: FBResponse) => {
      resolve(response);
    });
  });
}

export function fbLogin(scope = 'whatsapp_business_messaging'): Promise<FBResponse> {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded yet'));
      return;
    }

    window.FB.login((response: FBResponse) => {
      console.log('FB.login raw response:', response); // keep during dev

      if (response.status === 'connected' && response.authResponse) {
        resolve(response);
      } else if (response.status === 'not_authorized') {
        reject(new Error('Login cancelled or permissions not granted'));
      } else if (response.status === 'unknown') {
        reject(new Error('Login popup was closed or blocked'));
      } else {
        reject(new Error('Login failed — unexpected status'));
      }
    }, { scope });
  });
}

export function fbLogout(): Promise<void> {
  return new Promise((resolve) => {
    if (window.FB?.logout) {
      window.FB.logout(() => resolve());
    } else {
      resolve();
    }
  });
}