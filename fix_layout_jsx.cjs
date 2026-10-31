const fs = require('fs');

// --- UPDATE StationCard.jsx ---
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

// We need to completely replace the return block of StationCard
const returnRegex = /return\s*\(\s*<div className="home-station-card-neu">[\s\S]*?<\/div>\s*\);\s*\}/;

const newReturn = `return (
    <div className="home-station-card-neu">
      {/* Header Row: Title, Rating, Fav */}
      <div className="hsc-neu-header-row">
        <h3 className="hsc-neu-name">{station.name}</h3>
        <div className="hsc-neu-rating-fav">
          <div className="hsc-neu-rating">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>{station.rating ? station.rating.toFixed(1) : '0.0'}</span>
          </div>
          <button
            className={\`hsc-neu-fav-btn \${isFavorite ? 'active' : ''}\`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(station.id);
            }}
          >
            <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#a1a1aa'} />
          </button>
        </div>
      </div>

      {/* Address Row */}
      <div className="hsc-neu-address-row">
        <MapPin size={18} className="hsc-neu-icon-shrink" />
        <span>{station.address || station.city || 'Besh-Yog\\'och mahallasi, Chilonzor Tumani, Toshkent, 100000'}</span>
      </div>

      {/* Split Section: Distance & Status on left, Map on right */}
      <div className="hsc-neu-split-section">
        <div className="hsc-neu-split-left">
          <div className="hsc-neu-distance-stacked">
            <Navigation size={18} className="hsc-neu-nav-icon" />
            <span className="hsc-neu-dist-text">Sizdan <strong>{formatDistance(userDistance)}</strong><br/> uzoqlikda</span>
          </div>

          <div className="hsc-neu-status-wrapper">
            {isCurrentlyOpen ? (
              <div className="hsc-neu-status open">
                <Clock size={12} /> Hozir ochiq
              </div>
            ) : (
              <div className="hsc-neu-status closed">
                Yopiq
              </div>
            )}
          </div>
        </div>

        <div className="hsc-neu-split-right">
          <div className="hsc-neu-minimap-ring">
            <div className="hsc-neu-minimap-inner">
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
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      <button className="hsc-neu-action-btn" onClick={(e) => {
        e.stopPropagation();
        onSelectStation(station);
      }}>
        Kirish
      </button>
    </div>
  );
}`;

if (jsxContent.match(returnRegex)) {
  jsxContent = jsxContent.replace(returnRegex, newReturn);
  fs.writeFileSync(jsxPath, jsxContent, 'utf8');
  console.log("Updated StationCard JSX layout!");
} else {
  console.log("JSX regex match failed!");
}
