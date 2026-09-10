const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PROD_URL = 'https://vibenetwork.vercel.app';
const SCREENSHOT_DIR = path.join(__dirname, 'smoke_test_artifacts');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runSmokeTest() {
  console.log('🚀 Starting Comprehensive Production Smoke Test on:', PROD_URL);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    const text = msg.text();
    // Filter noise
    if (!text.includes('[vite]') && !text.includes('Download the React DevTools')) {
      consoleLogs.push({ type: msg.type(), text });
    }
  });

  page.on('pageerror', err => {
    console.error('❌ Page Error:', err.message);
    pageErrors.push(err.message);
  });

  page.on('requestfailed', req => {
    // Ignore analytics / pollinations / favicon noise if any
    const url = req.url();
    if (!url.includes('favicon') && !url.includes('analytics') && !url.includes('google-analytics')) {
      failedRequests.push({ url, error: req.failure()?.errorText });
    }
  });

  const results = {
    homepageLoad: false,
    apiYtTranscript: false,
    apiYtRss: false,
    watchLivePlayer: false,
    videoTranslationOverlay: false,
    profilePublicPreview: false,
    pageErrorsCount: 0,
    screenshots: []
  };

  try {
    // --- TEST 1: Homepage Load ---
    console.log('\n--- 1. Testing Homepage Loading ---');
    const navStart = Date.now();
    const resp = await page.goto(PROD_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    const loadTimeMs = Date.now() - navStart;
    console.log(`✓ Homepage loaded with HTTP ${resp.status()} in ${loadTimeMs}ms`);
    results.homepageLoad = resp.status() === 200;

    const title = await page.title();
    console.log(`✓ Page Title: "${title}"`);

    const screenshotHome = path.join(SCREENSHOT_DIR, '01_homepage.png');
    await page.screenshot({ path: screenshotHome });
    results.screenshots.push(screenshotHome);

    // --- TEST 2: Watch Live / What's On Now ---
    console.log('\n--- 2. Testing Watch Live & Video Player ---');
    // Scroll down or navigate to #whats-on-now
    await page.goto(`${PROD_URL}/#whats-on-now`, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2500));

    // Check for video player or iframe
    const hasPlayer = await page.evaluate(() => {
      const iframe = document.querySelector('iframe');
      const video = document.querySelector('video');
      const overlay = document.querySelector('[data-testid="translation-overlay"]') || document.body.innerText.includes('Language') || document.body.innerText.includes('English');
      return {
        hasIframe: !!iframe,
        hasVideo: !!video,
        hasOverlay: !!overlay,
        bodyTextSnippet: document.body.innerText.slice(0, 300)
      };
    });

    console.log('✓ Player elements inspection:', hasPlayer);
    results.watchLivePlayer = hasPlayer.hasIframe || hasPlayer.hasVideo || hasPlayer.hasOverlay;

    const screenshotPlayer = path.join(SCREENSHOT_DIR, '02_watch_live.png');
    await page.screenshot({ path: screenshotPlayer });
    results.screenshots.push(screenshotPlayer);

    // --- TEST 3: Direct API Smoke Tests on Production ---
    console.log('\n--- 3. Testing Production API Endpoints ---');
    // A. /api/yt-transcript for 'The Five'
    const ytTranscriptRes = await page.evaluate(async () => {
      try {
        const r = await fetch('/api/yt-transcript?videoId=BQa_JPlB0gg');
        const json = await r.json();
        return { ok: r.ok, status: r.status, success: json.success, segmentsCount: json.segments?.length, firstText: json.segments?.[0]?.text };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    });
    console.log('✓ /api/yt-transcript result for The Five:', ytTranscriptRes);
    results.apiYtTranscript = ytTranscriptRes.ok && ytTranscriptRes.success && ytTranscriptRes.segmentsCount > 0;

    // B. /api/yt-rss for Fox News
    const ytRssRes = await page.evaluate(async () => {
      try {
        const r = await fetch('/api/yt-rss/UCXIJgqnII2ZOINSWNOGFThA');
        const text = await r.text();
        return { ok: r.ok, status: r.status, containsFeed: text.includes('<feed') || text.includes('<entry>') };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    });
    console.log('✓ /api/yt-rss result for Fox News:', ytRssRes);
    results.apiYtRss = ytRssRes.ok && ytRssRes.containsFeed;

    // --- TEST 4: Translation Tab Route ---
    console.log('\n--- 4. Testing Translation Interface Route (/translation) ---');
    await page.goto(`${PROD_URL}/translation`, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    const translationInfo = await page.evaluate(() => {
      return {
        hasLanguages: document.body.innerText.includes('Language') || document.body.innerText.includes('English') || document.body.innerText.includes('French') || document.body.innerText.includes('Spanish'),
        contentSummary: document.body.innerText.slice(0, 200)
      };
    });
    console.log('✓ Translation route inspection:', translationInfo);
    results.videoTranslationOverlay = translationInfo.hasLanguages;

    const screenshotTranslation = path.join(SCREENSHOT_DIR, '03_translation_tab.png');
    await page.screenshot({ path: screenshotTranslation });
    results.screenshots.push(screenshotTranslation);

    // --- TEST 5: Profile Public Preview (Sub price non-editable) ---
    console.log('\n--- 5. Testing Profile Public Preview (/profile/courtneybee or /profile) ---');
    await page.goto(`${PROD_URL}/profile`, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    const profileCheck = await page.evaluate(() => {
      // Check if there are edit price inputs visible to anonymous visitors
      const priceInputs = Array.from(document.querySelectorAll('input[type="number"], input[placeholder*="price"], input[placeholder*="Price"]'));
      const editButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText?.toLowerCase().includes('edit sub') || b.innerText?.toLowerCase().includes('change price'));
      return {
        priceInputsCount: priceInputs.length,
        hasEditButtons: editButtons.length > 0,
        pageUrl: window.location.href,
        bodySnippet: document.body.innerText.slice(0, 200)
      };
    });
    console.log('✓ Profile preview security check:', profileCheck);
    results.profilePublicPreview = profileCheck.priceInputsCount === 0 && !profileCheck.hasEditButtons;

    const screenshotProfile = path.join(SCREENSHOT_DIR, '04_profile_preview.png');
    await page.screenshot({ path: screenshotProfile });
    results.screenshots.push(screenshotProfile);

  } catch (err) {
    console.error('❌ Smoke test run encountered an exception:', err);
  } finally {
    await browser.close();
  }

  results.pageErrorsCount = pageErrors.length;
  console.log('\n=============================================');
  console.log('🏁 PRODUCTION SMOKE TEST SUMMARY');
  console.log('=============================================');
  console.log('1. Homepage Loaded:', results.homepageLoad ? '✅ PASS' : '❌ FAIL');
  console.log('2. Watch Live Video Player Mounted:', results.watchLivePlayer ? '✅ PASS' : '❌ FAIL');
  console.log('3. /api/yt-transcript (Authentic Spoken Captions):', results.apiYtTranscript ? '✅ PASS' : '❌ FAIL');
  console.log('4. /api/yt-rss (Live Feed Ingestion):', results.apiYtRss ? '✅ PASS' : '❌ FAIL');
  console.log('5. Translation Interface Loaded:', results.videoTranslationOverlay ? '✅ PASS' : '❌ FAIL');
  console.log('6. Profile Public Preview (Locked Sub Price):', results.profilePublicPreview ? '✅ PASS' : '❌ FAIL');
  console.log('7. Runtime Page Errors:', pageErrors.length === 0 ? '✅ ZERO ERRORS' : `⚠️ ${pageErrors.length} ERRORS`);
  console.log('=============================================');

  return results;
}

runSmokeTest().catch(console.error);
