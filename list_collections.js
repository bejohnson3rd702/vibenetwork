async function run() {
  try {
    const res = await fetch('https://shopavo.la/collections.json');
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log("All Public Collections on shopavo.la:");
    for (const c of data.collections || []) {
      console.log(`- ${c.title} (handle: "${c.handle}", products_count: ${c.products_count})`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}
run();
