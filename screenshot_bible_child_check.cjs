const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  
  // 1. Check Parent Network (KPLE TV)
  const parentId = '33742e2f-430b-4c2d-9cba-42507891ef02';
  const parentUrl = `http://localhost:5173/?tenant=${parentId}`;
  console.log('Navigating to Parent Network:', parentUrl);
  await page.goto(parentUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));
  
  const parentHasFab = await page.evaluate(() => !!document.getElementById('kple-bible-fab'));
  console.log('Bible FAB exists on Parent Network:', parentHasFab);
  
  // 2. Check Child Network (TCT Network)
  const childId = '05b1ac75-a8ed-42d2-a147-c139f389cc35';
  const childUrl = `http://localhost:5173/?tenant=${childId}`;
  console.log('Navigating to Child Network:', childUrl);
  await page.goto(childUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));
  
  const childHasFab = await page.evaluate(() => !!document.getElementById('kple-bible-fab'));
  console.log('Bible FAB exists on Child Network:', childHasFab);
  
  await browser.close();
  console.log('Check finished!');
})();
