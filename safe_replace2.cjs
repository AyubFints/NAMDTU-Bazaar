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

const searchRegex = /\{filteredStations\.map\(st => \(\s*<StationCard[\s\S]*?onSelectStation=\{handleSelectStation\}\s*\/>\s*\)\)\}/m;

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

// We need to replace ONLY the first match, because there might be another one in 'search' tab
const match = searchRegex.exec(content);
if (match) {
  content = content.substring(0, match.index) + replacement + content.substring(match.index + match[0].length);
  fs.writeFileSync(jsxPath, content, 'utf8');
  console.log("Successfully replaced map function!");
} else {
  console.log("Did not match!");
}

