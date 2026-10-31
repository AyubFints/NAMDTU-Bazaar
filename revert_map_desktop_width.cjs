const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Revert max-width
cssContent = cssContent.replace(
  /\.compact-home-map-container \{\s*height: 260px;\s*margin-top: 20px;\s*width: 100%;\s*max-width: 800px;\s*margin-left: auto;\s*margin-right: auto;/m,
  '.compact-home-map-container {\n  height: 260px;\n  margin-top: 20px;\n  width: 100%;'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Desktop map max-width removed!");
