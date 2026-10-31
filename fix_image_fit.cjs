const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace objectFit cover with width 100%, height auto
content = content.replace(
  /style=\{\{ width: '100%', height: '100%', objectFit: 'cover' \}\}/g,
  `style={{ width: '100%', height: 'auto', display: 'block' }}`
);

// We need to also add height: auto to the container to override the 140px CSS rule
content = content.replace(
  /className="compact-home-map-container"/g,
  `className="compact-home-map-container" style={{ cursor: 'pointer', overflow: 'hidden', height: 'auto' }}`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Image fitting updated!");
