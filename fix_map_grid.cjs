const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Add grid-column: 1 / -1 to compact-home-map-wrapper so it spans all columns in the grid
cssContent = cssContent.replace(
  /\.compact-home-map-wrapper \{/m,
  '.compact-home-map-wrapper {\n  grid-column: 1 / -1;'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Made map wrapper span full grid width!");
