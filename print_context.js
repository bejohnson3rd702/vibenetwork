import fs from 'fs';

const html = fs.readFileSync('/Users/bennie/.gemini/antigravity/brain/a97abd78-a500-4b01-bebc-c6047b50f31e/.system_generated/steps/352/content.md', 'utf-8');

// Find window.PXUTheme.context = { ... }
const match = html.match(/window\.PXUTheme\.context\s*=\s*(\{[\s\S]*?\});/);
if (match) {
  try {
    const rawJson = match[1].replace(/(\w+)\s*:/g, '"$1":'); // Fix unquoted keys if any
    // Since it might contain functions or template expressions, let's just log the matched string
    console.log("Found context block:\n", match[1]);
  } catch (e) {
    console.error("Failed to parse JSON, raw text is:", match[1]);
  }
} else {
  console.log("No PXUTheme.context block found.");
}
