import fs from 'fs';

function run() {
  const filePath = '/Users/bennie/.gemini/antigravity/brain/fd71f833-22aa-4e86-be65-ae1ce42d17ff/.system_generated/steps/526/content.md';
  const html = fs.readFileSync(filePath, 'utf8');

  // Find all matches for headings and text
  const textBlocks = [];
  
  // Use a regex to extract text content of elements
  const tagRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>|<p[^>]*>([\s\S]*?)<\/p>|<span[^>]*>([\s\S]*?)<\/span>/gi;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const rawText = match[1] || match[2] || match[3] || '';
    const cleanText = rawText.replace(/<[^>]+>/g, '').trim();
    if (cleanText && !cleanText.includes('{') && !cleanText.includes('}') && cleanText.length > 2) {
      textBlocks.push(cleanText);
    }
  }

  // Remove duplicates and print
  const uniqueText = [...new Set(textBlocks)];
  console.log("EXTRACTED HEADING/TEXT NODES:");
  uniqueText.forEach(t => console.log("- " + t));
}

run();
