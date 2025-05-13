import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { url, format } = req.body;
  const id = uuidv4();
  const fileName = `${id}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
  const outputPath = path.join(downloadsDir, fileName);

  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

  const ytdlpPath = path.join(process.cwd(), 'bin', 'yt-dlp');
  const command = `${ytdlpPath} -o \"${downloadsDir}/${id}.%(ext)s\" ${url} ${format === 'mp3' ? '--extract-audio --audio-format mp3' : ''}`;

  exec(command, (err) => {
    if (err) return res.status(500).json({ error: 'Download failed', detail: err.message });
    const file = fs.readdirSync(downloadsDir).find(f => f.startsWith(id));
    return res.status(200).json({ url: `/downloads/${file}` });
  });
}