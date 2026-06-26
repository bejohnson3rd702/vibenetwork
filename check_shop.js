async function checkUrl(url) {
  try {
    const res = await fetch(url);
    console.log(`URL: ${url}`);
    console.log(`  Status: ${res.status} ${res.statusText}`);
    if (res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        console.log(`  Products: ${data.products?.length ?? 'none'}`);
        if (data.products?.length > 0) {
          console.log(`  First product: ${data.products[0].title}`);
          console.log(`  Tags: ${data.products[0].tags}`);
        }
      } catch {
        console.log(`  Response is not JSON. Length: ${text.length}`);
      }
    }
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }
}

async function run() {
  await checkUrl('https://shopavo.la/collections/alabama/products.json');
  await checkUrl('https://shopavo.la/collections/bama/products.json');
  await checkUrl('https://shopavo.la/collections/avo-x-bama/products.json');
  await checkUrl('https://shopavo.la/collections/baylor/products.json');
}
run();
