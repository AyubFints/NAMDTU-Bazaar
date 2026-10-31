const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Completely remove the height property from the inline style of the container
content = content.replace(
  /style=\{\{ cursor: 'pointer', overflow: 'hidden', height: '100%', backgroundColor: '#0b1329' \}\}/g,
  `style={{ cursor: 'pointer', overflow: 'hidden', backgroundColor: '#0b1329' }}`
);

// Also check if there's height: 'auto'
content = content.replace(
  /style=\{\{ cursor: 'pointer', overflow: 'hidden', height: 'auto', backgroundColor: '#0b1329' \}\}/g,
  `style={{ cursor: 'pointer', overflow: 'hidden', backgroundColor: '#0b1329' }}`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Removed inline height completely!");
