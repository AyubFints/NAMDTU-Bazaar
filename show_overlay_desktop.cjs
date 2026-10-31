const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const cssHideStr = `@media (min-width: 769px) {
  .map-overlay-title {
    display: none !important;
  }
}`;

cssContent = cssContent.replaceAll(cssHideStr, '');
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Removed the desktop hide logic for map overlay!");
