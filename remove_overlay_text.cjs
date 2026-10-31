const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Remove the overlay text div
const overlayRegex = /<div style=\{\{ position: 'absolute'[\s\S]*?Xaritada ko'rish\s*<\/div>/m;
content = content.replace(overlayRegex, '');

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Overlay text removed!");
