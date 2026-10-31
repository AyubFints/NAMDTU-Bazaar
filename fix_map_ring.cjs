const fs = require('fs');

// --- UPDATE StationCard.jsx ---
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

const oldVisualCol = `        <div className="hsc-neu-visual-col">
          <button
            className={\`hsc-neu-fav-btn \${isFavorite ? 'active' : ''}\`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(station.id);
            }}
          >
            <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#a1a1aa'} />
          </button>
          
          <div className="hsc-neu-minimap-ring">
            <div className="hsc-neu-minimap-inner">
              <img src="https://i.postimg.cc/prgQd6yP/map-preview.png" alt="Map Preview" />
            </div>
          </div>
        </div>`;

const mapLat = '${station.lat || 41.311081}';
const mapLng = '${station.lng || 69.240562}';
// Yandex static map URL
const yandexMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${mapLng},${mapLat}&z=15&size=200,200&l=map&pt=${mapLng},${mapLat},pm2rdm`;

const newVisualCol = `        <div className="hsc-neu-visual-col">
          <button
            className={\`hsc-neu-fav-btn \${isFavorite ? 'active' : ''}\`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(station.id);
            }}
          >
            <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#a1a1aa'} />
          </button>
          
          <div className="hsc-neu-minimap-ring">
            <div className="hsc-neu-minimap-inner">
              <img src={\`${yandexMapUrl}\`} alt="Map Preview" />
            </div>
          </div>
        </div>`;

jsxContent = jsxContent.replace(oldVisualCol, newVisualCol);
fs.writeFileSync(jsxPath, jsxContent, 'utf8');

// --- UPDATE App.css ---
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(/width: 80px;\s*height: 80px;/g, 'width: 110px;\n  height: 110px;');
cssContent = cssContent.replace(/\.hsc-neu-visual-col \{\s*display: flex;\s*flex-direction: column;\s*align-items: flex-end;\s*justify-content: space-between;\s*width: 90px;\s*\}/g, '.hsc-neu-visual-col {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  justify-content: space-between;\n  width: 120px;\n}');
cssContent = cssContent.replace(/width: 150%;\s*height: 150%;/g, 'width: 120%;\n  height: 120%;');

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Updated map ring size and added real Yandex static map!");
