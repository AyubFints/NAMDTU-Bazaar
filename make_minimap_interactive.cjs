const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const searchStr = `<MapContainer 
                center={[station.lat || 41.311081, station.lng || 69.240562]} 
                zoom={13} 
                zoomControl={false} 
                dragging={false} 
                scrollWheelZoom={false} 
                touchZoom={false} 
                doubleClickZoom={false}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >`;

const replacementStr = `<MapContainer 
                center={[station.lat || 41.311081, station.lng || 69.240562]} 
                zoom={14} 
                zoomControl={false} 
                dragging={true} 
                scrollWheelZoom={true} 
                touchZoom={true} 
                doubleClickZoom={true}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >`;

content = content.replace(searchStr, replacementStr);
fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Made the minimap interactive!");
