import fs from 'fs';

function cleanHtml(html) {
  return html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

try {
  const html = fs.readFileSync('kple_events_raw.html', 'utf8');
  const clean = cleanHtml(html);
  fs.writeFileSync('kple_events_clean.txt', clean);
  console.log('Clean text saved. Total length:', clean.length);
  
  // Print some lines that contain dates or common event keywords
  const lines = clean.split('\n');
  console.log('Total text lines:', lines.length);
  console.log('\n--- First 100 lines ---');
  console.log(lines.slice(0, 100).join('\n'));
  
  console.log('\n--- Search for keywords (Event, Date, Killeen, June, July, PM, AM) ---');
  for (const line of lines) {
    if (/event|date|killeen|june|july|pm|am|free|admission|address|street|time|hour|schedule/i.test(line)) {
      console.log('MATCH:', line);
    }
  }
} catch (err) {
  console.error(err);
}
