const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  
  // Capture page logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  const parentId = '33742e2f-430b-4c2d-9cba-42507891ef02';
  const url = `http://localhost:5173/?tenant=${parentId}`;
  console.log('Navigating to:', url);
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 6000)); // wait for full load
  
  // 1. Scroll to the Watch section and click play to launch video overlay
  console.log('Scrolling to Watch section...');
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const watchHeading = headings.find(h => h.textContent.includes('Watch'));
    if (watchHeading) {
      watchHeading.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      window.scrollTo(0, 1200);
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Clicking the play button on the featured video...');
  const playClicked = await page.evaluate(() => {
    const playButtons = Array.from(document.querySelectorAll('div')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.borderRadius === '50%' && (style.background.includes('rgba') || style.backgroundColor.includes('rgb') || el.style.background.includes('dd'));
    });
    
    if (playButtons.length > 0) {
      playButtons[0].click();
      return true;
    }
    return false;
  });
  console.log('Play clicked:', playClicked);
  await new Promise(r => setTimeout(r, 4000)); // wait for player overlay animation
  
  // Verify that the video player iframe exists
  const hasVideoIframeBefore = await page.evaluate(() => !!document.querySelector('iframe'));
  console.log('Video iframe exists before opening Bible:', hasVideoIframeBefore);
  
  // 2. Click the Bible FAB to open the drawer
  console.log('Clicking the Bible Floating Action Button...');
  const fabClicked = await page.evaluate(() => {
    const fab = document.getElementById('kple-bible-fab');
    if (fab) {
      fab.click();
      return true;
    }
    return false;
  });
  console.log('Bible FAB clicked:', fabClicked);
  await new Promise(r => setTimeout(r, 5000)); // wait for Bible drawer transition & API fetch
  
  // 3. Verify that the Bible drawer is open
  const isDrawerOpen = await page.evaluate(() => {
    const drawer = document.getElementById('kple-bible-drawer');
    return !!drawer;
  });
  console.log('Bible drawer is rendered:', isDrawerOpen);
  
  // 4. Verify that the video player is still present (meaning it did not stop/close)
  const hasVideoIframeAfter = await page.evaluate(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      return {
        src: iframe.src,
        visible: iframe.offsetWidth > 0 && iframe.offsetHeight > 0
      };
    }
    return null;
  });
  console.log('Video iframe info after opening Bible:', hasVideoIframeAfter);
  
  // 5. Capture screenshot of both overlay player and Bible drawer co-existing
  console.log('Capturing screenshot...');
  await page.screenshot({ path: 'kple_bible_overlay_fixed.png' });
  
  await browser.close();
  console.log('Done!');
})();
