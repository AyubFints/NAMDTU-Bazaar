const fs = require('fs');

// Add CSS class
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const cssAddition = `
.map-overlay-title {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  pointer-events: none;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 5;
}
`;
if (!cssContent.includes('.map-overlay-title')) {
  cssContent += cssAddition;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}

// Add to JSX
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

const searchStr = `<picture style={{ display: "block", width: "100%", height: "100%" }}>
                        <source media="(min-width: 769px)" srcSet="/map-preview-desktop.png" />
                        <img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                      </picture>
                      {/* Text overlays are no longer needed as desktop image has it baked in */}`;

const replacementStr = `<picture style={{ display: "block", width: "100%", height: "100%" }}>
                        <source media="(min-width: 769px)" srcSet="/map-preview-desktop.png" />
                        <img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                      </picture>
                      <div className="map-overlay-title">Harita</div>`;

jsxContent = jsxContent.replaceAll(searchStr, replacementStr);
fs.writeFileSync(jsxPath, jsxContent, 'utf8');
console.log("Added overlay title!");
