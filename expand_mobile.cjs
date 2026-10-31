const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// I will just append another mobile block that overrides the padding to expand everything
const expandCSS = `
/* EXPAND MOBILE CONTENT TO EDGES */
@media (max-width: 768px) {
  .content-area {
    padding: 0 8px !important;
  }
  .layout-padding {
    padding: 0 4px !important;
  }
  .home-brand-bar {
    padding: 8px 10px !important;
    margin: 10px 2px !important;
  }
}
`;

cssContent += expandCSS;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Expanded mobile layout to corners!");
