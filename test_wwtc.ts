import { getWwtcLanguages, translateText } from './src/lib/wwtc';

async function runTest() {
  console.log('--- Fetching Languages ---');
  try {
    const langs = await getWwtcLanguages();
    console.log(`Success! Retrieved ${langs.length} languages.`);
    console.log('Sample language:', langs[0]);
  } catch (err) {
    console.error('Failed to retrieve languages:', err);
  }

  console.log('\n--- Requesting Translation ---');
  try {
    const result = await translateText({
      text: 'Hello, how are you today?',
      sourceLang: 'english-united-states',
      targetLang: 'spanish-international',
      serviceCode: 'ttt'
    });
    console.log('Translation result:', result);
  } catch (err) {
    console.error('Failed to translate text:', err);
  }
}

runTest();
