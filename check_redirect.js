async function run() {
  try {
    const res = await fetch('https://shopavo.la/pages/avo-x-bama', { redirect: 'manual' });
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log("Headers:");
    res.headers.forEach((val, key) => {
      console.log(`  ${key}: ${val}`);
    });
    
    // Follow redirects manually if needed
    if (res.status >= 300 && res.status < 400) {
      console.log(`Redirect Location: ${res.headers.get('location')}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}
run();
