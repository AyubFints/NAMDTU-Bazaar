const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const bottomNavCSS = `
/* MOBILE NEUMORPHIC BOTTOM NAV */
@media (max-width: 768px) {
  .bottom-nav-bar {
    background: #f0f3f6 !important;
    box-shadow: 8px 8px 16px #d1d5db, -8px -8px 16px #ffffff !important;
    border: none !important;
    border-radius: 30px !important;
    padding: 6px !important;
    height: auto !important;
    bottom: 15px !important;
  }
  .bottom-nav-item {
    color: #64748b !important;
    font-weight: 600 !important;
    border-radius: 25px !important;
    padding: 8px 12px !important;
    background: transparent !important;
    transition: all 0.2s ease !important;
  }
  .bottom-nav-item.active {
    background: #e0f2fe !important;
    color: #0ea5e9 !important;
    box-shadow: inset 3px 3px 6px #bae6fd, inset -3px -3px 6px #ffffff !important;
  }
}
`;

cssContent += bottomNavCSS;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Applied neumorphic styles to mobile bottom nav!");
