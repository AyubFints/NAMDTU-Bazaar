const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent += `\n\n.compact-home-map-wrapper {\n  grid-column: 1 / -1;\n}\n`;

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Added grid-column: 1 / -1 for map wrapper!");
