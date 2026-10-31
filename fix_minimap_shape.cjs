const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Fix minimap shape
cssContent = cssContent.replace(
  /border-radius: 30% 70% 35% 65% \/ 55% 35% 65% 45%;/g,
  'border-radius: 16px;'
);

cssContent = cssContent.replace(
  /transform: rotate\(-15deg\);/g,
  ''
);

cssContent = cssContent.replace(
  /transform: translate\(-50%, -50%\) rotate\(15deg\);/g,
  'transform: translate(-50%, -50%);'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Minimap shape fixed!");
