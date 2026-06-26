const puppeteer = require('puppeteer');
const fs = require('fs');

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
  
  // Wait a few seconds to let any async data load
  await new Promise(r => setTimeout(r, 5000));
  
  // Scroll down to the Watch section
  await page.evaluate(() => {
    // Find heading with text "Watch"
    const headings = Array.from(document.querySelectorAll('h2'));
    const watchHeading = headings.find(h => h.textContent.includes('Watch'));
    if (watchHeading) {
      watchHeading.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      console.log('Watch heading not found, scrolling down');
      window.scrollTo(0, 1200);
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  console.log('Capturing Watch section...');
  await page.screenshot({ path: 'kple_watch_section_new.png' });
  
  // Click on the featured video (first big play button overlay or first card)
  console.log('Attempting to click play button...');
  const playClicked = await page.evaluate(() => {
    const playButtons = Array.from(document.querySelectorAll('div')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.borderRadius === '50%' && (style.background.includes('rgba') || style.backgroundColor.includes('rgb') || el.style.background.includes('dd'));
    });
    
    if (playButtons.length > 0) {
      console.log(`Found ${playButtons.length} play buttons. Clicking the first one.`);
      playButtons[0].click();
      return true;
    }
    
    // Fallback: click on anything that looks like a video card
    const cards = Array.from(document.querySelectorAll('img'));
    if (cards.length > 0) {
      console.log('Clicking first image card...');
      cards[0].click();
      return true;
    }
    
    return false;
  });
  
  console.log('Play clicked:', playClicked);
  
  // Wait for overlay to open and iframe to render
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Capturing player overlay...');
  await page.screenshot({ path: 'kple_player_overlay_new.png' });
  
  // Check if there is an iframe
  const hasIframe = await page.evaluate(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      return {
        src: iframe.src,
        width: iframe.width,
        height: iframe.height
      };
    }
    return null;
  });
  console.log('Iframe info:', hasIframe);
  
  await browser.close();
})();
