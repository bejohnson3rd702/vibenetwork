import fs from 'fs';

try {
  const filePath = '/Users/bennie/.gemini/antigravity/brain/fd71f833-22aa-4e86-be65-ae1ce42d17ff/.system_generated/steps/985/content.md';
  const fileContent = fs.readFileSync(filePath, 'utf8');
  console.log('File size:', fileContent.length);
  const lines = fileContent.split('\n');
  console.log('Total lines:', lines.length);
  for (let i = 0; i < lines.length; i++) {
    console.log(`Line ${i + 1}: length = ${lines[i].length}, start = ${lines[i].slice(0, 100)}`);
  }
} catch (err) {
  console.error('Error:', err);
}
