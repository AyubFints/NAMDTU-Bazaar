const fs = require('fs');

// --- UPDATE StationCard.jsx ---
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

if (!jsxContent.includes('import { MapContainer')) {
  jsxContent = jsxContent.replace(
    /import React from 'react';/,
    `import React from 'react';\nimport { MapContainer, TileLayer, Marker } from 'react-leaflet';\nimport L from 'leaflet';\nimport 'leaflet/dist/leaflet.css';`
  );
}

const mapLat = '${station.lat || 41.311081}';
const mapLng = '${station.lng || 69.240562}';
// Current image regex
const currentImg = /<img src=\{`https:\/\/static-maps\.yandex\.ru[\s\S]*?`\} alt="Map Preview" \/>/;

const newMap = `
              <MapContainer
                center={[station.lat || 41.311081, station.lng || 69.240562]}
                zoom={14}
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={true}
                dragging={true}
                style={{ width: '130%', height: '130%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(15deg)' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[station.lat || 41.311081, station.lng || 69.240562]} />
              </MapContainer>`;

jsxContent = jsxContent.replace(currentImg, newMap);
fs.writeFileSync(jsxPath, jsxContent, 'utf8');
console.log("Replaced static image with interactive MapContainer in StationCard!");
