export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let channelId = req.query.channelId;
    if (!channelId || channelId === '[channelId]') {
      const urlParts = (req.url || '').split('?')[0].split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart !== '[channelId]' && lastPart !== 'yt-rss') {
        channelId = lastPart;
      }
    }

    if (!channelId || channelId === '[channelId]') {
      return res.status(400).json({ error: 'channelId is required' });
    }

    const ytUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
    const ytRes = await fetch(ytUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(8000)
    });

    const xml = await ytRes.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(ytRes.status).send(xml);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch YouTube RSS feed' });
  }
}
