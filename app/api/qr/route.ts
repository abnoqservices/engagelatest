export const runtime = "nodejs";

// @ts-ignore
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    const { baseUrl } = await req.json();

    if (!baseUrl) {
      return new Response(JSON.stringify({ error: "baseUrl required" }), {
        status: 400,
      });
    }

    const dataUrl = await QRCode.toDataURL(baseUrl);

    // strip header and decode
    const base64 = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="qr.png"',
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "QR failed" }), {
      status: 500,
    });
  }
}
