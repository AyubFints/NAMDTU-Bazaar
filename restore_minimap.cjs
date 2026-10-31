const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const searchRegex = /<img src="\/map-preview\.jpg" alt="Mini Map" style=\{\{ width: '100%', height: '100%', objectFit: 'cover' \}\} \/>/g;
const replacementStr = `<MapContainer 
                key={station.id + Math.random().toString()}
                center={[station.lat || 41.311081, station.lng || 69.240562]} 
                zoom={14} 
                zoomControl={false} 
                dragging={true} 
                scrollWheelZoom={true} 
                touchZoom={true} 
                doubleClickZoom={true}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <Marker position={[station.lat || 41.311081, station.lng || 69.240562]} />
              </MapContainer>`;

content = content.replace(searchRegex, replacementStr);
fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Restored MapContainer with Math.random key!");
