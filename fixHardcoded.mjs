import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// 1. Replace hardcoded colors in React components
const colorMap = [
  { regex: /background:\s*['"]#(?:0a0a0a|050505|000|000000)['"]/gi, replacement: "background: 'var(--bg-color)'" },
  { regex: /background:\s*['"]#(?:111|111111|141414|1a1a1a)['"]/gi, replacement: "background: 'var(--bg-surface)'" },
  { regex: /background:\s*['"]#(?:222|2a2a2a|333)['"]/gi, replacement: "background: 'var(--bg-surface-hover)'" },
  
  { regex: /color:\s*['"]#(?:fff|ffffff)['"]/gi, replacement: "color: 'var(--text-primary)'" },
  { regex: /color:\s*['"]#(?:aaa|a3a3a3)['"]/gi, replacement: "color: 'var(--text-secondary)'" },
  { regex: /color:\s*['"]#(?:888|737373|666)['"]/gi, replacement: "color: 'var(--text-muted)'" },
  
  { regex: /border:\s*['"](.*?)(?:#(?:333|222|111|2a2a2a))['"]/gi, replacement: "border: '$1var(--bg-surface-hover)'" },
  { regex: /border(?:Color)?:\s*['"]#(?:333|222|111|2a2a2a)['"]/gi, replacement: "borderColor: 'var(--bg-surface-hover)'" },
];

let replacedCount = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    colorMap.forEach(mapping => {
      content = content.replace(mapping.regex, mapping.replacement);
    });
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      replacedCount++;
    }
  }
});

console.log(`Updated colors in ${replacedCount} frontend files.`);

// 2. Replace hardcoded localhost URLs in backend functions
const backendMap = [
  { regex: /['"]http:\/\/localhost:517[34](\/.*?)?['"]/g, replacement: "`\${req.headers.get('origin') || 'https://vibenetwork.tv'}$1`" },
  { regex: /refresh_url:\s*return_url\s*\|\|\s*`\$\{req.headers.get\('origin'\)\s*\|\|\s*'https:\/\/vibenetwork.tv'\}`/g, replacement: "refresh_url: return_url || (req.headers.get('origin') || 'https://vibenetwork.tv')" },
  { regex: /return_url:\s*return_url\s*\|\|\s*`\$\{req.headers.get\('origin'\)\s*\|\|\s*'https:\/\/vibenetwork.tv'\}`/g, replacement: "return_url: return_url || (req.headers.get('origin') || 'https://vibenetwork.tv')" }
];

let backendCount = 0;
if (fs.existsSync('./supabase/functions')) {
  walkDir('./supabase/functions', function(filePath) {
    if (filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      // Clean up localhost fallbacks
      content = content.replace(/['"]http:\/\/localhost:517[34](.*?)['"]/g, "`${req.headers.get('origin') || 'https://vibenetwork.tv'}$1`");
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        backendCount++;
      }
    }
  });
}

console.log(`Updated backend URLs in ${backendCount} files.`);
