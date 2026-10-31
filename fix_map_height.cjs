const fs = require('fs');

const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Change height of compact-home-map-container to 140px
cssContent = cssContent.replace(/height: 100px;/g, 'height: 140px;');
cssContent = cssContent.replace(/height: 100px !important;/g, 'height: 140px !important;');

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Map height changed to 140px!");
