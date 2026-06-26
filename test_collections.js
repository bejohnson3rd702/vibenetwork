// Using native fetch

async function checkCollection(handle) {
  const url = `https://shopavo.la/collections/${handle}/products.json`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      console.log(`Collection "${handle}": found ${data.products?.length || 0} products.`);
      if (data.products?.length > 0) {
        console.log(`Sample product: ${data.products[0].title} (Tags: ${data.products[0].tags})`);
      }
    } else {
      console.log(`Collection "${handle}": returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`Collection "${handle}": error ${err.message}`);
  }
}

async function run() {
  await checkCollection('alabama');
  await checkCollection('bama');
  await checkCollection('avo-x-bama');
}
run();
