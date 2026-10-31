const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(cssPath, 'utf8');

// Remove margin-top: 20px
content = content.replace(
  /\.compact-home-map-container \{\s*height: 260px;\s*margin-top: 20px;/m,
  '.compact-home-map-container {\n  height: 260px;'
);

fs.writeFileSync(cssPath, content, 'utf8');
console.log("Removed margin-top from map container!");
