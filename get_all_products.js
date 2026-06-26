async function fetchPage(page) {
  const url = `https://shopavo.la/products.json?limit=50&page=${page}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error(`Error on page ${page}:`, err.message);
    return null;
  }
}

async function run() {
  console.log("Fetching all products...");
  let page = 1;
  let allProducts = [];
  while (true) {
    const products = await fetchPage(page);
    if (!products || products.length === 0) break;
    console.log(`Page ${page}: found ${products.length} products.`);
    allProducts.push(...products);
    page++;
  }
  console.log(`Total products fetched: ${allProducts.length}`);
  
  // Let's filter for anything related to Alabama or bama
  const bamaProducts = allProducts.filter(p => 
    p.title.toLowerCase().includes('bama') || 
    p.title.toLowerCase().includes('alabama') ||
    p.tags.some(t => t.toLowerCase().includes('bama') || t.toLowerCase().includes('alabama'))
  );
  
  console.log(`\nAlabama/Bama related products (${bamaProducts.length}):`);
  for (const p of bamaProducts) {
    console.log(`- ${p.title} (handle: "${p.handle}")`);
    console.log(`  Tags: ${JSON.stringify(p.tags)}`);
  }
}

run();
