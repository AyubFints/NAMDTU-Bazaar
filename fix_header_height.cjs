const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// I will just append a more specific CSS rule that will override the previous ones
const newCss = `
/* ADJUST MOBILE HEADER HEIGHT AND TOP MARGIN */
@media (max-width: 768px) {
  .home-brand-bar {
    padding: 14px 12px !important;
    margin: 18px 2px 10px 2px !important;
  }
}
`;

cssContent += newCss;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Updated mobile header height and margin!");
