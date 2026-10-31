const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Overwrite the animation block entirely
cssContent = cssContent.replace(/\/\* ENHANCED ANIMATIONS FOR MAP AND FILTERS \*\/[\s\S]*?(?=(\/\*|$))/g, '');

const perfectTransitionCSS = `
/* ENHANCED ANIMATIONS FOR MAP AND FILTERS */
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
}
`;

cssContent += perfectTransitionCSS;
fs.writeFileSync(cssPath, cssContent, 'utf8');

const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// For Map: add transition-inner
appContent = appContent.replace(
  /<div className="compact-home-map-container">/,
  `<div className="transition-inner"><div className="compact-home-map-container">`
);
appContent = appContent.replace(
  /<MapView \/>\s*<\/div>\s*<\/div>/,
  `<MapView />\n                </div></div>\n              </div>`
);

// For Filters: add transition-inner
appContent = appContent.replace(
  /<div className=\{`fuel-filters-wrapper smooth-transition \$\{activeCategory === 'fuel' \? 'show' : 'hide'\}`\}>\s*<div className="home-sub-filters layout-padding">/,
  `<div className={\`fuel-filters-wrapper smooth-transition \${activeCategory === 'fuel' ? 'show' : 'hide'}\`}>\n              <div className="transition-inner">\n              <div className="home-sub-filters layout-padding">`
);
appContent = appContent.replace(
  /<\/div>\s*<\/div>\s*\{activeTab === 'home' && \(/,
  `</div>\n              </div>\n            </div>\n\n        {activeTab === 'home' && (`
);

fs.writeFileSync(appPath, appContent, 'utf8');
console.log("Applied perfect grid-template-rows transition!");
