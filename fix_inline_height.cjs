const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Remove the inline height: 'auto' from the compact-home-map-container
content = content.replace(
  /style=\{\{ cursor: 'pointer', overflow: 'hidden', height: 'auto', backgroundColor: '#0b1329' \}\}/g,
  `style={{ cursor: 'pointer', overflow: 'hidden', height: '100px', backgroundColor: '#0b1329' }}`
);

// Just in case, let's also fix it if I had put height: '100%' or something else earlier
content = content.replace(
  /height: '100px'/g,
  `height: '120px'` // Let's use 120px, 100px is very small.
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Fixed inline height!");
