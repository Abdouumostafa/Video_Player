import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface VideoUrls {
    [key: string]: string;
}

async function uploadVideos() {
    const videosDir = path.join(__dirname, '../public/videos');
    const files = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4'));

    const urls: VideoUrls = {};

    for (const file of files) {
        const filePath = path.join(videosDir, file);
        const fileBuffer = fs.readFileSync(filePath);

        const blob = await put(file, fileBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN!,
        });

        urls[file] = blob.url;
    }
}

uploadVideos().catch(console.error);
