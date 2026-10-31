const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const searchStr = `<img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                      <div className="desktop-only-map-text">Harita</div>`;
                      
const replacementStr = `<picture>
                        <source media="(min-width: 769px)" srcSet="/map-preview-desktop.png" />
                        <img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                      </picture>
                      {/* Text overlays are no longer needed as desktop image has it baked in */}`;

content = content.replaceAll(searchStr, replacementStr);
fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Updated map images to use picture tag!");
