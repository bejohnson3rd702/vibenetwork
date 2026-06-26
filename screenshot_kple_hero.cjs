const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  const parentId = '33742e2f-430b-4c2d-9cba-42507891ef02';
  const url = `http://localhost:5173/?tenant=${parentId}`;
  console.log('Navigating to:', url);
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));
  
  console.log('Capturing first slide...');
  await page.screenshot({ path: 'kple_hero_slide_1.png' });
  
  // Find the second slide dot and click it to capture the second slide
  console.log('Clicking second dot...');
  await page.evaluate(() => {
    // The slide dots are buttons right side, vertical
    const buttons = Array.from(document.querySelectorAll('button'));
    // Filter buttons that have style matching width/height 10px
    const dots = buttons.filter(btn => {
      const w = btn.style.width;
      const h = btn.style.height;
      return (w === '10px' && h === '10px') || (w === '10px' && h === '28px');
    });
    if (dots.length > 1) {
      dots[1].click();
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  console.log('Capturing second slide...');
  await page.screenshot({ path: 'kple_hero_slide_2.png' });
  
  await browser.close();
  console.log('Done!');
})();
