const fs = require('fs');

// --- UPDATE StationCard.jsx ---
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
const newJsx = `import React from 'react';
import { 
  Navigation, Clock, MapPin, Heart, Star, Zap
} from 'lucide-react';
import { formatDistance } from '../utils/distance';

export default function StationCard({
  station,
  userDistance,
  isFavorite,
  onToggleFavorite,
  onSelectStation
}) {
  const isCurrentlyOpen = station.isOpen !== false;

  return (
    <div className="home-station-card-neu">
      <div className="hsc-neu-top-row">
        {/* Left Column */}
        <div className="hsc-neu-info-col">
          <div className="hsc-neu-header">
            <h3 className="hsc-neu-name">{station.name}</h3>
          </div>

          <div className="hsc-neu-rating">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>{station.rating ? station.rating.toFixed(1) : '0.0'}</span>
          </div>

          <div className="hsc-neu-address">
            <MapPin size={14} className="hsc-neu-icon-shrink" />
            <span>{station.address || station.city || 'Besh-Yog\\'och mahallasi, Chilonzor Tumani, Toshkent'}</span>
          </div>

          <div className="hsc-neu-distance">
            <Navigation size={14} className="hsc-neu-icon-shrink" />
            <span>Sizdan <strong>{formatDistance(userDistance)}</strong> uzoqlikda</span>
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

        {/* Right Column */}
        <div className="hsc-neu-visual-col">
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
        </div>
      </div>

      <button className="hsc-neu-action-btn" onClick={() => onSelectStation(station)}>
        Kirish
      </button>
    </div>
  );
}
`;
fs.writeFileSync(jsxPath, newJsx, 'utf8');

// --- UPDATE App.css ---
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');
const newCss = `
/* ==========================================================================
   STATION CARD - NEUMORPHIC (Matches exact image)
   ========================================================================== */
.home-station-card-neu {
  background: #f0f3f6;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 8px 8px 16px #d1d5db, -8px -8px 16px #ffffff;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: none;
}

.hsc-neu-top-row {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 10px;
}

.hsc-neu-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hsc-neu-visual-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  width: 90px;
}

.hsc-neu-name {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.hsc-neu-fav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f3f6;
  box-shadow: inset 3px 3px 6px #d1d5db, inset -3px -3px 6px #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.hsc-neu-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  color: #1e293b;
  font-size: 0.95rem;
}

.hsc-neu-address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.78rem;
  color: #475569;
  line-height: 1.3;
}

.hsc-neu-distance {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #475569;
}

.hsc-neu-icon-shrink {
  flex-shrink: 0;
  margin-top: 1px;
}

.hsc-neu-status-wrapper {
  margin-top: 4px;
}
.hsc-neu-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}
.hsc-neu-status.open {
  background: #bbf7d0;
  color: #166534;
}
.hsc-neu-status.closed {
  background: #fecaca;
  color: #991b1b;
}

/* Mini map ring */
.hsc-neu-minimap-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f3f6;
  box-shadow: 5px 5px 10px #d1d5db, -5px -5px 10px #ffffff;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hsc-neu-minimap-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
}
.hsc-neu-minimap-inner img {
  width: 150%;
  height: 150%;
  object-fit: cover;
  opacity: 0.8;
}

.hsc-neu-action-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  cursor: pointer;
}
`;
if(!cssContent.includes('.home-station-card-neu')) {
  cssContent += newCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}

console.log("Updated StationCard to exactly match image!");
