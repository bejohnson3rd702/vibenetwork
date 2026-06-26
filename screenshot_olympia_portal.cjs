const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const parentId = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';
  const url = `http://localhost:5173/?tenant=${parentId}`;
  console.log('Navigating to Olympia Portal:', url);
  
  // Expose console logs from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText || ''));

  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'screenshot_olympia_portal.png' });
  
  await browser.close();
  console.log('Done!');
})();
