const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });

  console.log('Navigating to http://localhost:5173/?auto_admin=true ...');
  await page.goto('http://localhost:5173/?auto_admin=true', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Accept cookies first
  await page.evaluate(() => {
    const acceptBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent && el.textContent.includes('Accept All'));
    if (acceptBtn) acceptBtn.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // Click Dashboard button in top navbar
  await page.evaluate(() => {
    const dashBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent && el.textContent.includes('Dashboard'));
    if (dashBtn) dashBtn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click WWTC Translation tab in sidebar
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const translationBtn = buttons.find(b => b.textContent && (b.textContent.includes('WWTC Translation') || b.textContent.includes('Translation')));
    if (translationBtn) {
      translationBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Type text and run translation
  await page.evaluate(async () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
      textarea.value = 'Welcome to the global broadcast network. We are streaming worldwide in multiple languages.';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.click();
    }
  });

  console.log('Waiting for translation result...');
  await new Promise(r => setTimeout(r, 4500));

  await page.screenshot({ 
    path: '/Users/bennie/.gemini/antigravity/brain/533ab8bd-98e6-4e0c-a536-c5ad964096af/wwtc_workbench_preview.png',
    fullPage: false
  });

  console.log('Saved wwtc_workbench_preview.png successfully with translation result!');
  await browser.close();
})();
