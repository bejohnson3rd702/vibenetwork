const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  
  // Expose a function to capture console logs from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  const parentId = '33742e2f-430b-4c2d-9cba-42507891ef02';
  const url = `http://localhost:5173/?tenant=${parentId}`;
  console.log('Navigating to:', url);
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Wait a few seconds to let any async data load and ticker to mount
  await new Promise(r => setTimeout(r, 6000));
  
  console.log('Capturing top of page with ticker...');
  await page.screenshot({ path: 'kple_events_ticker_new.png' });
  
  // Get ticker content via DOM evaluation
  const tickerText = await page.evaluate(() => {
    // Find divs with relative positioning and zIndex 1000 or search for text like "Healing"
    const divs = Array.from(document.querySelectorAll('div')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.zIndex === '1000' && style.overflow === 'hidden';
    });
    if (divs.length > 0) {
      return divs[0].textContent;
    }
    return 'Ticker element not found';
  });
  console.log('Ticker Text content in DOM:', tickerText);
  
  await browser.close();
})();
