const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace the map ring CSS
const oldRingCssRegex = /\.hsc-neu-minimap-ring\s*\{[\s\S]*?\}\s*\.hsc-neu-minimap-inner\s*\{[\s\S]*?\}\s*\.hsc-neu-minimap-inner\s*img\s*\{[\s\S]*?\}/;

const newRingCss = `.hsc-neu-minimap-ring {
  width: 100px;
  height: 100px;
  /* Organic blob shape matching the image */
  border-radius: 42% 54% 45% 51% / 48% 46% 52% 45%;
  /* 3D bezel gradient */
  background: linear-gradient(145deg, #ffffff, #e2e8f0);
  /* Outer pop shadow and inner rim highlight */
  box-shadow: 
    5px 5px 12px rgba(166, 175, 195, 0.5), 
    -5px -5px 12px #ffffff,
    inset 2px 2px 4px rgba(255, 255, 255, 0.9),
    inset -2px -2px 4px rgba(0, 0, 0, 0.05);
  padding: 7px; /* thickness of the bezel */
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-5deg); /* Slight rotation to match the dynamic feel */
}
.hsc-neu-minimap-inner {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  /* Deep inset shadow to make the map look recessed inside the ring */
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
  background: #cbd5e1;
  position: relative;
}
.hsc-neu-minimap-inner img {
  width: 150%;
  height: 150%;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(5deg); /* Counter-rotate the image so it's upright */
  opacity: 0.95;
}`;

if (cssContent.match(oldRingCssRegex)) {
  cssContent = cssContent.replace(oldRingCssRegex, newRingCss);
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log("Updated map ring CSS!");
} else {
  console.log("Regex did not match!");
}
