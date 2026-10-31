const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Find where the bad string starts
const badStr = "/* enough for map or filters */";
const goodIndex = cssContent.indexOf(badStr);
if (goodIndex !== -1) {
  // Keep everything before the bad replacement happened (which is where the previous valid CSS ended)
  // Actually, we can just look for the end of the .sort-btn.active block
  const anchor = ".home-cat-btn.active, .gas-type-btn.active, .sort-btn.active {\n  background: #e0f2fe !important;\n  color: #0ea5e9 !important;\n  box-shadow: inset 3px 3px 6px #bae6fd, inset -3px -3px 6px #ffffff !important;\n}";
  const anchorIndex = cssContent.indexOf(anchor);
  
  if (anchorIndex !== -1) {
    const cleanCss = cssContent.substring(0, anchorIndex + anchor.length) + `\n\n/* ENHANCED ANIMATIONS FOR MAP AND FILTERS */
.smooth-transition {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease-out, opacity 0.4s ease-out, padding 0.4s ease-out, margin 0.4s ease-out;
  opacity: 0;
  pointer-events: none;
}
.smooth-transition > div.transition-inner {
  overflow: hidden;
}
.smooth-transition.show {
  grid-template-rows: 1fr;
  opacity: 1;
  pointer-events: auto;
}
.fuel-filters-wrapper.smooth-transition.show {
  transition-delay: 0.2s; /* wait for map */
}\n`;

    fs.writeFileSync(cssPath, cleanCss, 'utf8');
    console.log("Fixed CSS syntax error!");
  }
}
