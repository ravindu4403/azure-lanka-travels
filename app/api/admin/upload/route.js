import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const videoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const allowedTypes = [...imageTypes, ...videoTypes];
const maxSizeBytes = 60 * 1024 * 1024;

function cleanName(name = 'upload') {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'media';
  return `${base}-${Date.now()}${ext}`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestedFolder = String(formData.get('folder') || '').toLowerCase();

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'Please choose an image or video file.' }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Only JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, OGG or MOV files are allowed.' }, { status: 400 });
    }

    if (file.size > maxSizeBytes) {
      return NextResponse.json({ success: false, message: 'File is too large. Maximum upload size is 60MB.' }, { status: 400 });
    }

    const isVideo = videoTypes.includes(file.type);
    const rootFolder = isVideo ? 'videos' : 'images';
    const folder = requestedFolder && /^[a-z0-9-]+$/.test(requestedFolder) ? `${rootFolder}/${requestedFolder}` : rootFolder;
    const fileName = cleanName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${folder}/${fileName}`.replaceAll('\\', '/');
      return NextResponse.json({
        success: true,
        fileUrl: publicUrl,
        mediaType: isVideo ? 'Video' : 'Image',
        fileName,
        size: file.size,
        storage: 'public-folder',
      });
    } catch (writeError) {
      // Some preview hosts like Vercel/Netlify run serverless functions on a read-only filesystem.
      // In that case we return a data URL so the admin preview and JSON database can still save/display the media.
      // cPanel Node or local XAMPP normally uses the public/uploads folder above.
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({
        success: true,
        fileUrl: dataUrl,
        mediaType: isVideo ? 'Video' : 'Image',
        fileName,
        size: file.size,
        storage: 'database-data-url-fallback',
        message: `Preview/server storage is read-only, so media was saved as embedded data. Original write error: ${writeError.message}`,
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || 'Upload failed.' }, { status: 500 });
  }
}
