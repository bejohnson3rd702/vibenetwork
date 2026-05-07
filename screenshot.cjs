const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot.png' });
  
  const content = await page.content();
  if (content.includes('hero-title-mobile') || content.includes('Hero Billboard OS') || content.includes('The Ultimate White Label Architecture')) {
    console.log("Hero section FOUND in DOM.");
  } else {
    console.log("Hero section NOT FOUND.");
  }
  
  // print out any react errors
  console.log("Page title: ", await page.title());
  
  await browser.close();
})();
