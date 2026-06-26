async function run() {
  const res = await fetch(`https://shopavo.la/products.json?limit=30&page=1`);
  if (res.ok) {
    const data = await res.json();
    console.log("First 30 products:");
    data.products.forEach((p, i) => {
      console.log(`${i+1}. "${p.title}" (handle: "${p.handle}", tags: ${JSON.stringify(p.tags)})`);
    });
  }
}
run();
