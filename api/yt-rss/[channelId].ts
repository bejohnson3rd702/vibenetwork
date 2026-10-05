function escapeXml(unsafe: string): string {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchFromRss2Json(channelId: string): Promise<string | null> {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) return null;

    const entries = data.items.map((item: any) => {
      const vid = item.guid?.replace(/^yt:video:/, '') || (item.link || '').match(/v=([^&]+)/)?.[1] || '';
      const pub = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
      const thumb = item.thumbnail || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : '');
      return `  <entry>
    <id>yt:video:${escapeXml(vid)}</id>
    <yt:videoId>${escapeXml(vid)}</yt:videoId>
    <title>${escapeXml(item.title)}</title>
    <link rel="alternate" href="${escapeXml(item.link)}"/>
    <published>${escapeXml(pub)}</published>
    <media:group>
      <media:title>${escapeXml(item.title)}</media:title>
      <media:description>${escapeXml(item.description || item.title)}</media:description>
      <media:thumbnail url="${escapeXml(thumb)}"/>
    </media:group>
  </entry>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(data.feed?.title || 'YouTube Feed')}</title>
${entries}
</feed>`;
  } catch {
    return null;
  }
}

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
    
    // 1. First attempt: Direct YouTube XML fetch
    let xml: string | null = null;
    try {
      const ytRes = await fetch(ytUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        signal: AbortSignal.timeout(6000)
      });

      if (ytRes.ok) {
        xml = await ytRes.text();
      }
    } catch {
      // Primary fetch failed or timed out, will fall back below
    }

    // 2. Fallback attempt: If YouTube direct returned 404, 403, 500, or timed out
    if (!xml || xml.includes('404. That’s an error')) {
      const fallbackXml = await fetchFromRss2Json(channelId);
      if (fallbackXml) {
        xml = fallbackXml;
      }
    }

    if (!xml || xml.includes('404. That’s an error')) {
      return res.status(404).json({ error: `Could not retrieve RSS feed for channel ${channelId}` });
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800');
    res.status(200).send(xml);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch YouTube RSS feed' });
  }
}
