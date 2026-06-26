const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const parentId = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';
  const url = `http://localhost:5173/?tenant=${parentId}`;
  console.log('Navigating to:', url);

  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));
  
  const imgData = await page.evaluate(() => {
    // Find all images on the page
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      visible: img.offsetWidth > 0 && img.offsetHeight > 0,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      className: img.className,
      style: img.getAttribute('style')
    }));
  });

  console.log("Images on page:");
  console.log(JSON.stringify(imgData, null, 2));

  await browser.close();
})();
