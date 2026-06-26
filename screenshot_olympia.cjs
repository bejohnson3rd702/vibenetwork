const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:5173/?tenant=7a017c4d-c08f-4260-8540-a0cc8bed4e11', { waitUntil: 'networkidle2' });
  
  // Wait a bit for initial render
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Scroll to bottom to trigger animations
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 30);
    });
  });
  
  // Scroll back to top so screenshot starts at the top
  await page.evaluate(() => window.scrollTo(0, 0));
  
  // Wait another second for final layout settle
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await page.screenshot({ path: 'screenshot_olympia.png', fullPage: true });
  console.log("Page title: ", await page.title());
  
  await browser.close();
})();
