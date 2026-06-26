async function test() {
  const url = 'https://kpletv.org/local-events-5881';
  console.log('Fetching:', url);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      console.error('Fetch failed:', res.status, res.statusText);
      return;
    }
    const html = await res.text();
    console.log('Successfully fetched, length:', html.length);
    fs.writeFileSync('kple_events_raw.html', html);
    console.log('Saved to kple_events_raw.html');
  } catch (err) {
    console.error('Error fetching:', err);
  }
}

import fs from 'fs';
test();
