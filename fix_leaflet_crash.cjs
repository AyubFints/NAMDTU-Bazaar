const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace MapContainer block with a static image
const regex = /<MapContainer[\s\S]*?<\/MapContainer>/m;
const replacement = `<img 
                src={\`https://static-maps.yandex.ru/1.x/?ll=\${station.lng || 69.240562},\${station.lat || 41.311081}&size=150,150&z=14&l=map&pt=\${station.lng || 69.240562},\${station.lat || 41.311081},pm2blm\`} 
                alt="Mini Map" 
              />`;

content = content.replace(regex, replacement);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Replaced MapContainer with static Yandex map image!");
