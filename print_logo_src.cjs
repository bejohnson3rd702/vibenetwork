const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/?tenant=e5c100aa-c08f-4260-8540-a0cc8bed4e11', { waitUntil: 'networkidle2' });
  
  const src = await page.evaluate(() => {
    const img = document.querySelector('img[alt="VIBE 100"]');
    return img ? img.src : null;
  });
  
  console.log("Logo Image Source:", src);
  await browser.close();
})();
