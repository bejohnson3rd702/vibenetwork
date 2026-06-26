async function run() {
  try {
    const res = await fetch('https://shopavo.la/collections.json?limit=100');
    if (res.ok) {
      const data = await res.json();
      console.log(`Collections found: ${data.collections?.length || 0}`);
      for (const c of data.collections || []) {
        console.log(`- ${c.title} (handle: "${c.handle}")`);
      }
    } else {
      console.log(`Error: ${res.status}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}
run();
