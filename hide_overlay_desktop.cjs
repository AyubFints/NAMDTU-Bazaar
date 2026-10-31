const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const cssHide = `
@media (min-width: 769px) {
  .map-overlay-title {
    display: none !important;
  }
}
`;
if (!cssContent.includes('.map-overlay-title {\\n    display: none !important;')) {
  cssContent += cssHide;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}
console.log("Hid overlay on desktop!");
