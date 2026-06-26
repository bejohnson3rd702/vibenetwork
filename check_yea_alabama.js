async function checkUrl(url) {
  try {
    const res = await fetch(url);
    console.log(`URL: ${url}`);
    console.log(`  Status: ${res.status} ${res.statusText}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`  Products count: ${data.products?.length ?? 'none'}`);
      if (data.products?.length > 0) {
        console.log(`  First product: ${data.products[0].title}`);
        console.log(`  Tags: ${data.products[0].tags}`);
      }
    }
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }
}

async function run() {
  await checkUrl('https://yea-alabama.com/products.json');
  await checkUrl('https://yea-alabama.com/collections/all/products.json');
  await checkUrl('https://yea-alabama.com/collections/avo/products.json');
  await checkUrl('https://yea-alabama.com/collections/avo-x-bama/products.json');
}
run();
