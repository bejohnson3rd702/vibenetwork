import fs from 'fs';

function run() {
  const filePath = '/Users/bennie/.gemini/antigravity/brain/fd71f833-22aa-4e86-be65-ae1ce42d17ff/.system_generated/steps/526/content.md';
  const html = fs.readFileSync(filePath, 'utf8');

  // Simple regex to strip HTML tags and print text
  let text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<[^>]+>/g, '\n');
  
  // Collapse whitespace
  text = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  console.log(text.substring(0, 5000));
}

run();
