// app/api/upload-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { images, gallery, pdfs } = data;
    
    // Ensure upload directories exist
    const imageUploadDir = path.join(process.cwd(), 'public', 'upload', 'productgallery');
    const pdfUploadDir = path.join(process.cwd(), 'public', 'upload', 'productdocs');
    
    await mkdir(imageUploadDir, { recursive: true });
    await mkdir(pdfUploadDir, { recursive: true });
    
    const savedImages: any[] = [];
    const savedGallery: any[] = [];
    const savedPdfs: any[] = [];
    
    // Process product images
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.base64 && img.base64.startsWith('data:')) {
          // Extract base64 data
          const base64Data = img.base64.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Generate unique filename
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const ext = img.name.split('.').pop() || 'jpg';
          const filename = `product-${timestamp}-${randomStr}.${ext}`;
          const filepath = path.join(imageUploadDir, filename);
          
          // Save file
          await writeFile(filepath, buffer);
          
          savedImages.push({
            id: img.id,
            name: img.name,
            url: `/upload/productgallery/${filename}`,
            savedPath: filepath
          });
        }
      }
    }
    
    // Process gallery images
    if (gallery && Array.isArray(gallery)) {
      for (const img of gallery) {
        if (img.base64 && img.base64.startsWith('data:')) {
          const base64Data = img.base64.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const ext = img.name.split('.').pop() || 'jpg';
          const filename = `gallery-${timestamp}-${randomStr}.${ext}`;
          const filepath = path.join(imageUploadDir, filename);
          
          await writeFile(filepath, buffer);
          
          savedGallery.push({
            id: img.id,
            name: img.name,
            url: `/upload/productgallery/${filename}`,
            savedPath: filepath
          });
        }
      }
    }
    
    // Process PDF documents
    if (pdfs && Array.isArray(pdfs)) {
      for (const pdf of pdfs) {
        if (pdf.base64 && pdf.base64.startsWith('data:')) {
          const base64Data = pdf.base64.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          // Sanitize filename - remove special characters
          const sanitizedName = pdf.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const nameWithoutExt = sanitizedName.replace('.pdf', '');
          const filename = `${nameWithoutExt}-${timestamp}-${randomStr}.pdf`;
          const filepath = path.join(pdfUploadDir, filename);
          
          await writeFile(filepath, buffer);
          
          savedPdfs.push({
            id: pdf.id,
            name: pdf.name,
            url: `/upload/productdocs/${filename}`,
            size: pdf.size || buffer.length,
            savedPath: filepath
          });
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Files saved successfully',
      data: {
        images: savedImages,
        gallery: savedGallery,
        pdfs: savedPdfs
      }
    });
    
  } catch (error: any) {
    console.error('Error saving files:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save files' },
      { status: 500 }
    );
  }
}