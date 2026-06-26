const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1800 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  const url = `http://localhost:5173/`;
  console.log('Navigating to:', url);
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Wait a few seconds to let any async data load
  await new Promise(r => setTimeout(r, 6000));
  
  // Try to click "Accept All" on privacy banner
  console.log('Attempting to dismiss cookie consent...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const acceptBtn = buttons.find(b => b.textContent.includes('Accept All'));
    if (acceptBtn) {
      acceptBtn.click();
      console.log('Clicked Accept All button');
    } else {
      console.log('Accept All button not found');
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Scroll down to the Watch section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const watchHeading = headings.find(h => h.textContent.includes('Watch'));
    if (watchHeading) {
      watchHeading.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      console.log('Watch heading not found, scrolling down');
      window.scrollTo(0, 1500);
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Capturing Vibe Homepage...');
  const screenshotPath = '/Users/bennie/.gemini/antigravity/brain/fd71f833-22aa-4e86-be65-ae1ce42d17ff/screenshot_vibe_watch_updated.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);
  
  await browser.close();
})();
