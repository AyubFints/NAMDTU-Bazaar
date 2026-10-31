const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const searchStr = `{filteredStations.map(st => (
                <StationCard
                  key={st.id}
                  station={st}
                  userDistance={st.calculatedDistance}
                  isFavorite={favorites.includes(st.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectStation={(s) => setDetailStation(s)}
                  onNavigate={handleNavigate}
                />
              ))}`;

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

const replacementStr = `{filteredStations.map((st, index) => (
                <React.Fragment key={st.id}>
                  <StationCard
                    station={st}
                    userDistance={st.calculatedDistance}
                    isFavorite={favorites.includes(st.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectStation={(s) => setDetailStation(s)}
                    onNavigate={handleNavigate}
                  />
                  {(index === 2 || (filteredStations.length < 3 && index === filteredStations.length - 1)) && (
                    ${mapCode}
                  )}
                </React.Fragment>
              ))}`;

if (content.indexOf(searchStr) !== -1) {
  content = content.replace(searchStr, replacementStr);
  fs.writeFileSync(jsxPath, content, 'utf8');
  console.log("Successfully replaced map logic!");
} else {
  console.log("String not found!");
}
