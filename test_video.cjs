const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText)
  );

  console.log('Navigating to AVO Network page...');
  await page.goto('http://localhost:5173/?tenant=3915f1e5-4c79-4b2a-ad41-7029ce8052d7', { waitUntil: 'networkidle2' });
  
  // Wait a bit for clips to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Find all elements containing text "Watch" or "🏈 Football" or similar
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body includes "Watch":', bodyText.includes('Watch'));
  console.log('Body includes "Football":', bodyText.includes('Football'));

  // Click on the featured video card. In WatchLive.tsx, the featured card has featured.headline as alt text or title:
  // <img src={featured.thumbnail} alt={featured.headline} ... />
  // We can click the image!
  const hasImage = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => img.alt).filter(Boolean);
  });
  console.log('Image alts found:', hasImage);

  if (hasImage.length > 0) {
    console.log('Clicking the video card to open video player...');
    await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const videoCard = images.find(img => img.alt && (img.alt.includes("Monken") || img.alt.includes("Dante Moore") || img.alt.includes("Cignetti")));
      if (videoCard) {
        videoCard.click();
      } else {
        console.error('Video card image element not found in DOM!');
      }
    });
    
    console.log('Waiting for video player overlay...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Let's inspect the video tag source and state, and call play()
    const videoState = await page.evaluate(async () => {
      const video = document.querySelector('video');
      if (!video) return 'No video element found';
      
      let playError = null;
      try {
        await video.play();
      } catch (e) {
        playError = { name: e.name, message: e.message };
      }
      
      return {
        src: video.src,
        currentSrc: video.currentSrc,
        paused: video.paused,
        playError: playError,
        error: video.error ? { code: video.error.code, message: video.error.message } : null,
        networkState: video.networkState,
        readyState: video.readyState
      };
    });
    console.log('Video Player State after play():', videoState);
  }

  await browser.close();
})();
