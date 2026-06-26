import fs from 'fs';

const html = fs.readFileSync('/Users/bennie/.gemini/antigravity/brain/a97abd78-a500-4b01-bebc-c6047b50f31e/.system_generated/steps/352/content.md', 'utf-8');

// Find all script tags
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  const scriptContent = match[1].trim();
  const scriptTag = match[0];
  const srcMatch = scriptTag.match(/src="([^"]*)"/);
  if (srcMatch) {
    console.log(`Script ${count} (src): ${srcMatch[1]}`);
  } else if (scriptContent.length > 0) {
    console.log(`Script ${count} (inline, length ${scriptContent.length}): ${scriptContent.substring(0, 150)}...`);
  }
}
