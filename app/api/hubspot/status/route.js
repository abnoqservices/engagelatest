import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // ✅ cookies() must be awaited
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("hubspot_access_token");
  const refreshToken = cookieStore.get("hubspot_refresh_token");

  if (!accessToken) {
    return NextResponse.json({
      connected: false,
    });
  }

  return NextResponse.json({
    connected: true,
    token: accessToken.value ? "available" : null,
    expiresIn: accessToken?.expires ?? null,
    hasRefreshToken: !!refreshToken,
  });
}
