const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(cssPath, 'utf8');

// The mobile map container CSS
const searchStr = `@media (max-width: 768px) {
  .compact-home-map-container {
    height: 65px !important;
  }
}`;

const replacementStr = `@media (max-width: 768px) {
  .compact-home-map-container {
    height: 140px !important;
  }
}`;

if (content.indexOf(searchStr) !== -1) {
  content = content.replace(searchStr, replacementStr);
  fs.writeFileSync(cssPath, content, 'utf8');
  console.log("Restored mobile map container height to 140px!");
} else {
  console.log("Could not find the exact string.");
}
