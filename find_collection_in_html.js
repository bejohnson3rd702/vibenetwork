import fs from 'fs';

const html = fs.readFileSync('/Users/bennie/.gemini/antigravity/brain/a97abd78-a500-4b01-bebc-c6047b50f31e/.system_generated/steps/352/content.md', 'utf-8');

// Let's look for anything matching "collection" or handles/IDs in the HTML
const regexes = [
  /collection[-_]id/gi,
  /collections\/([a-zA-Z0-9-_]+)/g,
  /data-collection-id="([^"]+)"/g,
  /collectionHandle:\s*"([^"]+)"/g,
  /handle:\s*"([^"]+)"/g,
  /id:\s*(\d{10,})/g
];

console.log("Analyzing HTML for collection patterns...");
for (const regex of regexes) {
  let match;
  while ((match = regex.exec(html)) !== null) {
    console.log(`Matched: ${match[0]} -> ${match[1]}`);
  }
}
