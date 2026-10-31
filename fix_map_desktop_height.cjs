const fs = require('fs');

const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace the first height: 140px; which is the desktop one, to 220px
cssContent = cssContent.replace(
  /\.compact-home-map-container \{\s*height: 140px;/m,
  '.compact-home-map-container {\n  height: 220px;'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Desktop map height changed to 220px!");
