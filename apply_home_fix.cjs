const fs = require('fs');

const orig = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx.bak', 'utf8');

// The original main block starts with `<main className="content-area pb-20">`
const mainStart = orig.indexOf('<main className="content-area pb-20">');
const mainEnd = orig.indexOf('</main>') + 7;

let oldMain = orig.substring(mainStart, mainEnd);

// We need to remove the `{activeTab === 'home' && ...}` blocks from oldMain.
// 1. The CategoryTabs block: `{(activeTab === 'home' || activeTab === 'search') && (`
// Change this to `{activeTab === 'search' && (`
oldMain = oldMain.replace(/\{\(activeTab === 'home' \|\| activeTab === 'search'\) && \(/, "{activeTab === 'search' && (");

// 2. The home cards block: `{activeTab === 'home' && (`
const homeCardsStart = oldMain.indexOf("{activeTab === 'home' && (");
// It ends right before `        {/* SEARCH */}` or similar. Let's find `{activeTab === 'search' && (`
const searchCardsStart = oldMain.indexOf("{activeTab === 'search' && (", homeCardsStart);
// Remove the home cards block
oldMain = oldMain.substring(0, homeCardsStart) + oldMain.substring(searchCardsStart);


// NOW build the NEW home block.
const newHomeBlock = `
        {/* NEW DARK HOME SPLIT LAYOUT */}
        {activeTab === 'home' && (
          <div className="dark-theme-home">
            <header className="top-header">
              <div className="logo">
                <h1>myup.uz</h1>
              </div>
              <nav className="desktop-nav">
                <button className="desktop-nav-item" onClick={() => handleTabChange('search')}>
                  <Search size={18} className="desktop-nav-icon" />
                  <span>Qidiruv</span>
                </button>
                <button className="desktop-nav-item" onClick={() => handleTabChange('map')}>
                  <Map size={18} className="desktop-nav-icon" />
                  <span>Xarita</span>
                </button>
                <button className="desktop-nav-item" onClick={() => handleTabChange('my')}>
                  <User size={18} className="desktop-nav-icon" />
                  <span>Profil</span>
                </button>
                <button className="desktop-nav-item" onClick={() => setShowSettingsModal(true)}>
                  <Settings size={18} className="desktop-nav-icon" />
                  <span>Sozlamalar</span>
                </button>
              </nav>
            </header>

            <div className="app-content">
              {/* LEFT PANEL */}
              <div className="left-panel">
                <div className="fuel-filter-grid">
                  <button className={\`fuel-btn \${fuelSubFilter === 'metan' ? 'active' : ''}\`} onClick={() => setFuelSubFilter('metan')}>
                    <Flame className="fuel-icon" size={20} /> Metan Gaz
                  </button>
                  <button className={\`fuel-btn \${fuelSubFilter === 'benzin' ? 'active' : ''}\`} onClick={() => setFuelSubFilter('benzin')}>
                    <Droplets className="fuel-icon" size={20} /> Benzin
                  </button>
                  <button className={\`fuel-btn \${fuelSubFilter === 'propan' ? 'active' : ''}\`} onClick={() => setFuelSubFilter('propan')}>
                    <Flame className="fuel-icon" size={20} /> Propan
                  </button>
                  <button className={\`fuel-btn \${fuelSubFilter === 'elektr' ? 'active' : ''}\`} onClick={() => setFuelSubFilter('elektr')}>
                    <Zap className="fuel-icon" size={20} /> Elektr Zaryadlash
                  </button>
                </div>
                
                <div className="station-list">
                  {filteredStations.map(station => (
                    <StationCard
                      key={station.id}
                      station={station}
                      userDistance={station.calculatedDistance}
                      isFavorite={favorites.includes(station.id)}
                      onToggleFavorite={handleToggleFavorite} 
                      onSelectStation={setDetailStation}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT PANEL MAP */}
              <div className="right-panel-map">
                <MapView />
              </div>
            </div>
          </div>
        )}
`;

// Wrap the old main block so it doesn't render on home tab
const finalMain = `
      ${newHomeBlock}

      {activeTab !== 'home' && (
        ${oldMain}
      )}
`;

const head = orig.substring(0, mainStart);
const tail = orig.substring(mainEnd);

const finalAppJsx = head + finalMain + tail;

// Ensure Search, Map, Settings icons are imported
let fixedAppJsx = finalAppJsx;
if (!fixedAppJsx.includes('Search,')) {
  fixedAppJsx = fixedAppJsx.replace(/import \{/, 'import { Search, Map, Settings, Zap, Flame, Droplets, ');
}

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx', fixedAppJsx, 'utf8');
console.log('App.jsx updated perfectly!');
