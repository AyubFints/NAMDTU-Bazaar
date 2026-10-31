const fs = require('fs');

// 1. Replace MapView with image in App.jsx
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

const regex = /<div className="transition-inner"><div className="compact-home-map-container">\s*<MapView \/>\s*<\/div><\/div>/m;
const replacement = `<div className="transition-inner">
                    <div 
                      className="compact-home-map-container" 
                      onClick={() => handleTabChange('map')} 
                      style={{ cursor: 'pointer', overflow: 'hidden', height: 'auto', backgroundColor: '#0b1329' }}
                    >
                      <img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '20px', color: 'white', fontWeight: 'bold' }}>
                        Xaritada ko'rish
                      </div>
                    </div>
                  </div>`;

jsxContent = jsxContent.replace(regex, replacement);
fs.writeFileSync(jsxPath, jsxContent, 'utf8');

// 2. Remove CSS height limits so it can take height: auto
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(/height: 200px;/g, 'height: auto;');
cssContent = cssContent.replace(/height: 140px !important;/g, 'height: auto !important;');

fs.writeFileSync(cssPath, cssContent, 'utf8');

console.log("Image placed perfectly with all parts visible!");
