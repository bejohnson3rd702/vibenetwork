const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  
  // Find card with text "VIBE 100"
  const imgCard = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.slider-section img'));
    const vibeCard = cards.find(img => img.alt && img.alt.includes('VIBE 100'));
    return vibeCard ? vibeCard.src : null;
  });
  
  console.log("Slider Card Image Source:", imgCard);
  await browser.close();
})();
