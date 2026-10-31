const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Restore the minimap ring shape and dimensions
cssContent = cssContent.replace(
  /\.hsc-neu-minimap-ring \{[\s\S]*?\}/m,
  `.hsc-neu-minimap-ring {
  width: 100px;
  height: 100px;
  border-radius: 30% 70% 35% 65% / 55% 35% 65% 45%;
  background: linear-gradient(145deg, #ffffff, #e2e8f0);
  box-shadow: 5px 5px 12px rgba(166, 175, 195, 0.5), -5px -5px 12px #ffffff, inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 4px rgba(0, 0, 0, 0.05);
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-15deg);
}`
);

// Restore the image counter-rotation
cssContent = cssContent.replace(
  /transform: translate\(-50%, -50%\); \/\* Counter-rotate the image so it's upright \*\//g,
  `transform: translate(-50%, -50%) rotate(15deg); /* Counter-rotate the image so it's upright */`
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Restored the original blob shape!");
