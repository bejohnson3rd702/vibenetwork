const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  
  const parentId = '33742e2f-430b-4c2d-9cba-42507891ef02';
  const url = `http://localhost:5173/?tenant=${parentId}`;
  console.log('Navigating to:', url);
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 5000));
  
  // Scroll to Trending section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const trendingHeading = headings.find(h => h.textContent.includes('TRENDING') || h.textContent.includes('Trending'));
    if (trendingHeading) {
      trendingHeading.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      window.scrollTo(0, 2200);
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  console.log('Capturing Trending section...');
  await page.screenshot({ path: 'kple_trending_fixed.png' });
  
  await browser.close();
  console.log('Done!');
})();
