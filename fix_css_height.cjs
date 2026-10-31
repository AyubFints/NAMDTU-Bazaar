const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(cssPath, 'utf8');

// Remove the strict height limits on compact-home-map-container
content = content.replace(/height: 200px;/g, 'height: auto;');
content = content.replace(/height: 140px !important;/g, 'height: auto !important;');

fs.writeFileSync(cssPath, content, 'utf8');
console.log("Fixed CSS height limits!");
