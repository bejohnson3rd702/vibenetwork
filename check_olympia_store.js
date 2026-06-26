async function test(url) {
  try {
    const res = await fetch(url);
    console.log(`URL: ${url}`);
    console.log(`  Status: ${res.status} ${res.statusText}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`  Products: ${data.products?.length}`);
    }
  } catch (err) {
    console.log(`URL: ${url} | Error: ${err.message}`);
  }
}

async function run() {
  await test('https://mrolympia.com/products.json');
  await test('https://mrolympia.com/collections/all/products.json');
}

run();
