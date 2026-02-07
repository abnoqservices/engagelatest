'use server';

import { redirect } from 'next/navigation';

export async function exchangeCodeForToken(data: {
  code: string;
  wabaId: string;
  phoneId: string;
}) {
  const { code } = data;

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/embedded-signup`, // must match dashboard
    });

    const res = await fetch(
      `https://graph.facebook.com/${process.env.GRAPH_API_VERSION}/oauth/access_token?${params}`,
      { method: 'POST' }
    );

    const result = await res.json();

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    // In production: store in database (user → { waba_id, phone_number_id, access_token })
    // For demo: return to client (insecure – do NOT do this long-term)
    return {
      success: true,
      token: result.access_token,
      expires: result.expires_in,
      wabaId: data.wabaId,
      phoneId: data.phoneId,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}