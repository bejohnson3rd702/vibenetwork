async function run() {
  try {
    const res = await fetch('https://shopavo.la/collections/shop-all/products.json?limit=250');
    if (res.ok) {
      const data = await res.json();
      const products = data.products || [];
      console.log(`Total products in Shop All collection: ${products.length}`);
      
      const bama = products.filter(p => 
        p.title.toLowerCase().includes('bama') || 
        p.title.toLowerCase().includes('alabama') ||
        p.tags.some(t => t.toLowerCase().includes('bama') || t.toLowerCase().includes('alabama'))
      );
      
      console.log(`\nAlabama/Bama related products in Shop All (${bama.length}):`);
      for (const p of bama) {
        console.log(`- ${p.title} (handle: "${p.handle}")`);
        console.log(`  Tags: ${JSON.stringify(p.tags)}`);
      }
      
      // Let's also print all unique tags in this collection
      const tags = new Set();
      products.forEach(p => p.tags.forEach(t => tags.add(t)));
      console.log("\nAll unique tags in Shop All collection:", Array.from(tags));
    } else {
      console.log(`Error: ${res.status}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}
run();
