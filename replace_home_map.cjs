const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace the MapView in home tab with an image
const regex = /<div className="transition-inner"><div className="compact-home-map-container">\s*<MapView \/>\s*<\/div><\/div>/m;
const replacement = `<div className="transition-inner">
                    <div 
                      className="compact-home-map-container" 
                      onClick={() => handleTabChange('map')} 
                      style={{ cursor: 'pointer', overflow: 'hidden' }}
                    >
                      <img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '20px', color: 'white', fontWeight: 'bold' }}>
                        Xaritada ko'rish
                      </div>
                    </div>
                  </div>`;

content = content.replace(regex, replacement);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Replaced home MapView with preview image!");
