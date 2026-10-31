const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

content = content.replace(
  /\{station\.category === 'fuel' && station\.prices && \(/,
  `{station.prices && Object.keys(station.prices).length > 0 && (`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Removed strict category check for prices in StationCard!");
