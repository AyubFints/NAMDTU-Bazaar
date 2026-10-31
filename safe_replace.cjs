const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const mapCode = `<div className={\`compact-home-map-wrapper smooth-transition \${activeCategory === 'all' ? 'show my-3' : 'hide'}\`}>
                  <div className="transition-inner">
                    <div 
                      className="compact-home-map-container" 
                      onClick={() => handleTabChange('map')} 
                      style={{ cursor: 'pointer', overflow: 'hidden', backgroundColor: '#0b1329' }}
                    >
                      <img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                      <div className="desktop-only-map-text">Harita</div>
                    </div>
                  </div>
                </div>`;

const searchStr1 = `{/* Barchasi tanlanganda ixcham xarita ko'rsatiladi */}`;
const searchStr2 = `<div className="cards-stream-container layout-padding mt-4">`;

let startIdx = content.indexOf(searchStr1);
let endIdx = content.indexOf(searchStr2, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
}

// Now replace the mapping part. It's inside the <div className="cards-stream-container layout-padding mt-4"> block under activeTab === 'home'
// Let's find exactly that block.
const mapBlockStart = `{filteredStations.map(st => (`;
const idxMap = content.indexOf(mapBlockStart);
if (idxMap !== -1) {
  // Let's replace only the first occurrence (which is in the home tab).
  const mapBlockFull = `{filteredStations.map(st => (
                  <StationCard
                    key={st.id}
                    station={st}
                    userDistance={st.calculatedDistance}
                    isFavorite={favorites.includes(st.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectStation={handleSelectStation}
                  />
                ))}`;
  
  const replacement = `{filteredStations.map((st, index) => (
                  <React.Fragment key={st.id}>
                    <StationCard
                      station={st}
                      userDistance={st.calculatedDistance}
                      isFavorite={favorites.includes(st.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectStation={handleSelectStation}
                    />
                    {(index === 2 || (filteredStations.length < 3 && index === filteredStations.length - 1)) && (
                      ${mapCode}
                    )}
                  </React.Fragment>
                ))}
                
                {filteredStations.length === 0 && (
                  ${mapCode}
                )}`;
                
  content = content.replace(mapBlockFull, replacement);
  fs.writeFileSync(jsxPath, content, 'utf8');
  console.log("Success!");
} else {
  console.log("Could not find map block.");
}
