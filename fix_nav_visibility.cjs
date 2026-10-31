const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(/@media \(max-width: 768px\) \{\s*\.desktop-nav \{\s*display: none !important;\s*\}\s*\}/, '');

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Removed the media query hiding desktop-nav on smaller screens!");
