const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const searchStr = `<img \n                src="/map-preview.jpg" \n                alt="Mini Map" \n              />`;
const altSearchStr = `<img src="/map-preview.jpg" alt="Mini Map" />`;
const searchRegex = /<img\s*src="\/map-preview\.jpg"\s*alt="Mini Map"\s*\/>/g;

const replacementStr = `<MapContainer 
                center={[station.lat || 41.311081, station.lng || 69.240562]} 
                zoom={13} 
                zoomControl={false} 
                dragging={false} 
                scrollWheelZoom={false} 
                touchZoom={false} 
                doubleClickZoom={false}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <Marker position={[station.lat || 41.311081, station.lng || 69.240562]} />
              </MapContainer>`;

content = content.replace(searchRegex, replacementStr);
fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Updated StationCard to use real MapContainer!");
