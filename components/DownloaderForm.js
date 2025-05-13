import { useState } from 'react';

export default function DownloaderForm() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [downloadLink, setDownloadLink] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format })
    });
    const data = await res.json();
    setDownloadLink(data.url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste video URL" required />
      <select value={format} onChange={e => setFormat(e.target.value)}>
        <option value="mp4">MP4</option>
        <option value="mp3">MP3</option>
      </select>
      <button type="submit">Download</button>
      {downloadLink && <a href={downloadLink} download>Download File</a>}
    </form>
  );
}