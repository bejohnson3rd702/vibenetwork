import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join } from 'path';

(async () => {
  console.log('⏳ Launching headless browser...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('📄 Creating new page...');
    const page = await browser.newPage();
    
    console.log('📖 Reading benefits.html...');
    const htmlPath = join(process.cwd(), 'benefits.html');
    const htmlContent = readFileSync(htmlPath, 'utf8');
    
    console.log('🌐 Loading HTML content into page...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    console.log('🖨  Printing page to PDF...');
    await page.pdf({
      path: 'benefits_of_owning_a_channel_and_network.pdf',
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      },
      printBackground: true
    });
    
    console.log('✅ PDF generated successfully: benefits_of_owning_a_channel_and_network.pdf');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
