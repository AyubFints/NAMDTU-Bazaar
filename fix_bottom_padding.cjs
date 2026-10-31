const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const paddingCSS = `
/* ADD EXTRA SPACE AT BOTTOM ON MOBILE SO LAST ITEM IS NOT HIDDEN BY NAV */
@media (max-width: 768px) {
  .content-area {
    padding-bottom: 130px !important;
  }
}
`;

cssContent += paddingCSS;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Added 130px bottom padding to content-area on mobile!");
