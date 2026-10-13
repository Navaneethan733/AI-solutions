const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Replace local image paths from .jpg / .jpeg / .png to .webp
  content = content.replace(/assets\/images\/([a-zA-Z0-9_\-]+)\.(?:jpg|jpeg|png)/gi, 'assets/images/$1.webp');

  // 2. Ensure all Unsplash image URLs explicitly specify fm=webp
  content = content.replace(/https:\/\/images\.unsplash\.com\/[^\s"'>)]+/gi, (url) => {
    // If it already has fm=..., replace it with fm=webp
    if (/([?&])fm=[^&]+/i.test(url)) {
      return url.replace(/([?&])fm=[^&]+/i, '$1fm=webp');
    }
    // If it has query params, append &fm=webp
    if (url.includes('?')) {
      return url + '&fm=webp';
    }
    // If no query params, append ?fm=webp
    return url + '?fm=webp';
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Conversion complete!');
