async function checkUrl(handle) {
  const url = `https://shopavo.la/collections/${handle}/products.json`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.products?.length > 0) {
        console.log(`FOUND! Handle "${handle}" has ${data.products.length} products.`);
        console.log(`First product: ${data.products[0].title}`);
        return true;
      }
    }
  } catch (err) {
    // Ignore error
  }
  return false;
}

async function run() {
  const handles = [
    'university-of-alabama',
    'alabama-crimson-tide',
    'alabama-crimson',
    'alabama-tide',
    'crimson-tide',
    'alabama-university',
    'alabama',
    'bama',
    'bama-tide',
    'avo-x-bama',
    'avoxbama',
    'alabama-collection',
    'roll-tide',
    'ua-crimson-tide',
    'bama-crimson-tide'
  ];
  
  console.log("Checking handles...");
  for (const h of handles) {
    const found = await checkUrl(h);
    if (found) {
      console.log(`Bingo! The correct handle is: ${h}`);
    }
  }
  console.log("Done checking.");
}

run();
