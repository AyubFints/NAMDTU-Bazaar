const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// 1. Remove the line hiding bottom-nav-bar on mobile
cssContent = cssContent.replace(
  /\/\* Hide the old bottom nav since we now use the header nav on mobile too \*\/\s*\.bottom-nav-bar\s*\{\s*display:\s*none\s*!important;\s*\}/,
  ''
);

// 2. Hide desktop-nav on mobile
if (!cssContent.includes('.desktop-nav { display: none !important; }')) {
  cssContent = cssContent.replace(
    /@media \(max-width: 768px\) \{/,
    `@media (max-width: 768px) {
  .desktop-nav { display: none !important; }`
  );
}

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Fixed mobile/desktop nav visibility logic!");
