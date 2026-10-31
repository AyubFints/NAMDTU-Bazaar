const fs = require('fs');

// 1. Restore App.jsx
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

const regex = /<div className="transition-inner">\s*<div\s*className="compact-home-map-container"[\s\S]*?Xaritada ko'rish\s*<\/div>\s*<\/div>\s*<\/div>/m;
const replacement = `<div className="transition-inner"><div className="compact-home-map-container">
                    <MapView />
                  </div></div>`;

jsxContent = jsxContent.replace(regex, replacement);
fs.writeFileSync(jsxPath, jsxContent, 'utf8');


// 2. Restore App.css
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(/height: auto;/g, 'height: 200px;');
cssContent = cssContent.replace(/height: auto !important;/g, 'height: 140px !important;');

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Reverted to original MapView!");
