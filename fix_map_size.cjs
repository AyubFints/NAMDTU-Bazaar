const fs = require('fs');

// 1. Restore App.css heights
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(/height: auto;/g, 'height: 200px;');
cssContent = cssContent.replace(/height: auto !important;/g, 'height: 140px !important;');

fs.writeFileSync(cssPath, cssContent, 'utf8');

// 2. Change App.jsx image to cover
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

jsxContent = jsxContent.replace(/objectFit: 'contain'/g, "objectFit: 'cover'");
jsxContent = jsxContent.replace(/height: 'auto'/g, "height: '100%'");

fs.writeFileSync(jsxPath, jsxContent, 'utf8');
console.log("Restored exact map size and shape!");
