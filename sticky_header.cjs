const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const desktopHeaderCss = `
/* DESKTOP HEADER STICKY AND WIDER */
@media (min-width: 769px) {
  .home-brand-bar {
    position: sticky !important;
    top: 15px !important;
    margin: 15px 5px !important;
    z-index: 100 !important;
  }
}
`;

cssContent += desktopHeaderCss;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Made desktop header sticky and slightly wider!");
