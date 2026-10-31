const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const searchRegex = /<MapContainer[\s\S]*?<\/MapContainer>/g;
const replacementStr = `<img src="/map-preview.jpg" alt="Mini Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />`;

content = content.replace(searchRegex, replacementStr);
fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Reverted minimap to static image!");
