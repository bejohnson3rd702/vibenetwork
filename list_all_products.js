async function run() {
  let allProducts = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`https://shopavo.la/products.json?limit=50&page=${page}`);
    if (res.ok) {
      const data = await res.json();
      if (data.products) allProducts.push(...data.products);
    }
  }
  
  console.log(`Listing all ${allProducts.length} products:`);
  allProducts.forEach((p, i) => {
    console.log(`${i+1}. "${p.title}" (handle: "${p.handle}", tags: ${JSON.stringify(p.tags)})`);
  });
}
run();
