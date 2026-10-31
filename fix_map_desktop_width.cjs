const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Add max-width to the container to make it smaller on desktop
cssContent = cssContent.replace(
  /\.compact-home-map-container \{\s*height: 260px;\s*margin-top: 20px;\s*width: 100%;/m,
  '.compact-home-map-container {\n  height: 260px;\n  margin-top: 20px;\n  width: 100%;\n  max-width: 800px;\n  margin-left: auto;\n  margin-right: auto;'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Desktop map constrained with max-width!");
