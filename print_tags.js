async function run() {
  let allProducts = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`https://shopavo.la/products.json?limit=50&page=${page}`);
    if (res.ok) {
      const data = await res.json();
      if (data.products) allProducts.push(...data.products);
    }
  }
  
  const tags = new Set();
  allProducts.forEach(p => p.tags.forEach(t => tags.add(t)));
  console.log("All unique tags:", Array.from(tags));
}
run();
