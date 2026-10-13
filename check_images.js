const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /(?:src|href|url)\s*=\s*['"]([^'"]+)['"]|url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  let match;
  const imageRefs = [];
  while ((match = regex.exec(content)) !== null) {
    const val = match[1] || match[2];
    if (val && (val.includes('unsplash.com') || /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(val))) {
      imageRefs.push(val);
    }
  }
  if (imageRefs.length > 0) {
    console.log(file + ': ' + imageRefs.length + ' image references');
    imageRefs.forEach(ref => console.log('  ' + ref));
  }
});
