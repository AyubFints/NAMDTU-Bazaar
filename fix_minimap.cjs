const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace yandex static map with local map preview
content = content.replace(
  /src=\{`https:\/\/static-maps\.yandex\.ru\/1\.x\/\?ll=\$\{station\.lng \|\| 69\.240562\},\$\{station\.lat \|\| 41\.311081\}&size=150,150&z=14&l=map&pt=\$\{station\.lng \|\| 69\.240562\},\$\{station\.lat \|\| 41\.311081\},pm2bll`\}/g,
  'src="/map-preview.jpg"'
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Updated StationCard minimap to use local image!");
