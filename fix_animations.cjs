const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// 1. Add neumorphism to sub-filter-pill
if (!cssContent.includes('.sub-filter-pill {')) {
  const newCss = `
.sub-filter-pill {
  background: #f0f3f6 !important;
  box-shadow: 5px 5px 10px #d1d5db, -5px -5px 10px #ffffff !important;
  border: none !important;
  color: #64748b !important;
  transition: all 0.2s ease !important;
}
.sub-filter-pill.active {
  background: #e0f2fe !important;
  color: #0ea5e9 !important;
  box-shadow: inset 3px 3px 6px #bae6fd, inset -3px -3px 6px #ffffff !important;
}

.smooth-transition {
  transition: all 0.4s ease-in-out;
  overflow: hidden;
}
.smooth-transition.hide {
  opacity: 0;
  max-height: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.smooth-transition.show {
  opacity: 1;
  max-height: 600px;
}
`;
  cssContent += newCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}

const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// 2. Replace map rendering
const mapOriginal = `{activeCategory === 'all' && (
              <div className="compact-home-map-wrapper layout-padding mt-3">
                <div className="compact-home-map-container">
                  <MapView />
                </div>
              </div>
            )}`;
const mapNew = `<div className={\`compact-home-map-wrapper layout-padding smooth-transition \${activeCategory === 'all' ? 'show mt-3' : 'hide'}\`}>
                <div className="compact-home-map-container">
                  <MapView />
                </div>
              </div>`;

if (appContent.includes(mapOriginal)) {
  appContent = appContent.replace(mapOriginal, mapNew);
} else {
  // Try regex if spacing differs
  appContent = appContent.replace(
    /\{activeCategory === 'all' && \(\s*<div className="compact-home-map-wrapper layout-padding mt-3">\s*<div className="compact-home-map-container">\s*<MapView \/>\s*<\/div>\s*<\/div>\s*\)\}/,
    mapNew
  );
}

// 3. Replace fuel sub-filters rendering
const fuelOriginalRegex = /\{activeCategory === 'fuel' && \(\s*<>\s*(<div className="home-sub-filters layout-padding">[\s\S]*?)<\/>\s*\)\}/;
appContent = appContent.replace(fuelOriginalRegex, (match, p1) => {
  return `<div className={\`fuel-filters-wrapper smooth-transition \${activeCategory === 'fuel' ? 'show' : 'hide'}\`}>\n              ${p1}\n            </div>`;
});

fs.writeFileSync(appPath, appContent, 'utf8');
console.log("Applied animations and neumorphism!");
