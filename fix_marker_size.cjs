const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace pm2blm with pm2bll (blue large)
content = content.replace(/pm2blm/g, 'pm2bll');

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Made map marker larger!");
