const fs = require('fs');

const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Change 220px to 260px and add margin-top
cssContent = cssContent.replace(
  /\.compact-home-map-container \{\s*height: 220px;/m,
  '.compact-home-map-container {\n  height: 260px;\n  margin-top: 20px;'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Desktop map height changed to 260px and moved down!");
