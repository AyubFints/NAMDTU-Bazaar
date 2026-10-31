const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace the old border-radius with an extreme blob shape
cssContent = cssContent.replace(
  /border-radius:\s*42%\s*54%\s*45%\s*51%\s*\/\s*48%\s*46%\s*52%\s*45%;/,
  'border-radius: 30% 70% 35% 65% / 55% 35% 65% 45%;'
);

// We can also increase the rotation to make it look more dynamic
cssContent = cssContent.replace(
  /transform:\s*rotate\(-5deg\);/,
  'transform: rotate(-15deg);'
);
cssContent = cssContent.replace(
  /transform:\s*translate\(-50%,\s*-50%\)\s*rotate\(5deg\);/,
  'transform: translate(-50%, -50%) rotate(15deg);'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Updated border-radius to extreme blob shape!");
