const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(cssPath, 'utf8');

// Replace the bad height in bottom-nav-bar
content = content.replace(
  /height: 140px !important;/g,
  'height: 65px !important;'
);

fs.writeFileSync(cssPath, content, 'utf8');
console.log("Fixed mobile bottom nav height!");
