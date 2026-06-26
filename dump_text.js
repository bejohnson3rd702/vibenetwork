import fs from 'fs';

const html = fs.readFileSync('/Users/bennie/.gemini/antigravity/brain/a97abd78-a500-4b01-bebc-c6047b50f31e/.system_generated/steps/352/content.md', 'utf-8');

// Strip html tags
const text = html.replace(/<[^>]*>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();

console.log("Page text content snippet (end):");
console.log(text.substring(text.length - 2000));

