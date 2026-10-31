const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const neumorphicButtonsCss = `
/* APPLY NEUMORPHIC STYLES TO CATEGORY AND FILTER BUTTONS */
.home-cat-btn, .gas-type-btn, .sort-btn {
  background: #f0f3f6 !important;
  box-shadow: 5px 5px 10px #d1d5db, -5px -5px 10px #ffffff !important;
  border: none !important;
  color: #64748b !important;
  transition: all 0.2s ease !important;
}

.home-cat-btn.active, .gas-type-btn.active, .sort-btn.active {
  background: #e0f2fe !important;
  color: #0ea5e9 !important;
  box-shadow: inset 3px 3px 6px #bae6fd, inset -3px -3px 6px #ffffff !important;
}
`;

cssContent += neumorphicButtonsCss;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Applied neumorphic styles to filter buttons!");
