import fs from 'fs';

const html = fs.readFileSync('/Users/bennie/.gemini/antigravity/brain/a97abd78-a500-4b01-bebc-c6047b50f31e/.system_generated/steps/352/content.md', 'utf-8');

// Strip head, scripts, and style tags
let bodyOnly = html.replace(/<head[\s\S]*?<\/head>/gi, '')
                   .replace(/<script[\s\S]*?<\/script>/gi, '')
                   .replace(/<style[\s\S]*?<\/style>/gi, '')
                   .replace(/<[^>]*>/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim();

console.log("Visible Text Length:", bodyOnly.length);
console.log("Visible Text:\n", bodyOnly.substring(3000));

