const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/?tenant=7a017c4d-c08f-4260-8540-a0cc8bed4e11', { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const state = await page.evaluate(() => {
    const el = document.getElementById('child-networks-slider');
    return {
      exists: !!el,
      height: el ? el.offsetHeight : 0,
      width: el ? el.offsetWidth : 0,
      visible: el ? (el.offsetWidth > 0 && el.offsetHeight > 0) : false,
      title: el ? el.querySelector('h2')?.innerText : '',
      itemTitles: el ? Array.from(el.querySelectorAll('h3')).map(h => h.innerText) : [],
    };
  });
  console.log("Slider State:", state);
  await browser.close();
})();
