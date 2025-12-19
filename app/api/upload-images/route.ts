import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    // ✅ VERY IMPORTANT: valid JSON response
    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        s3_key: fileName,
        name: file.name,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      { status: 500 }
    );
  }
}
