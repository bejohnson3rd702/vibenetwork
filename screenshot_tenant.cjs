const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Expose a function to capture console logs from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  // Set fake local network in localStorage to force tenant mode
  await page.goto('http://localhost:5174/');
  await page.evaluate(() => {
    localStorage.setItem('vibe_local_networks', JSON.stringify([{ id: 'test', name: 'Test Network' }]));
  });
  
  await page.goto('http://localhost:5174/?tenant=test', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'screenshot_tenant.png' });
  
  const content = await page.content();
  console.log("Page title: ", await page.title());
  if (content.includes('Live Network Initialized')) {
    console.log("Network Hero FOUND!");
  } else {
    console.log("Network Hero MISSING!");
  }
  
  await browser.close();
})();
