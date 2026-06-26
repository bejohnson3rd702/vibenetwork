async function test() {
  const channelId = 'UCmkgg5el8Fg3IX_baZyfSaQ';
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Fetch failed:', res.status, res.statusText);
      return;
    }
    const xml = await res.text();
    console.log('Successfully fetched XML, length:', xml.length);
    if (xml.includes('<entry>')) {
      console.log('XML contains entries!');
      const entries = xml.split('<entry>');
      for (let i = 1; i < Math.min(entries.length, 6); i++) {
        const entry = entries[i];
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const ytIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        console.log(`Video ${i}:`);
        console.log(`  Title: ${titleMatch ? titleMatch[1] : 'Unknown'}`);
        console.log(`  ID: ${ytIdMatch ? ytIdMatch[1] : 'Unknown'}`);
      }
    } else {
      console.log('No entries found in XML.');
    }
  } catch (err) {
    console.error('Error fetching:', err);
  }
}

test();
