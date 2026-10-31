const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace the price rendering to be null-safe
content = content.replace(
  /\{value\.toLocaleString\(\)\}/g,
  `{value ? Number(value).toLocaleString() : '—'}`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Made StationCard price rendering safe!");
