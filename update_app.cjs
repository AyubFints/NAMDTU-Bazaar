const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Find the start of the return statement in App component
const returnStartIndex = content.indexOf('return (');
if (returnStartIndex === -1) {
  console.log('Return statement not found');
  process.exit(1);
}

// Find the end of the main return statement
// We look for the NavigationMode modal which is outside the main layout
const navModeIndex = content.lastIndexOf('if (navigationTarget) {');

const beforeReturn = content.substring(0, returnStartIndex);
const afterReturn = content.substring(navModeIndex);

const newReturn = `return (
    <div className="app-container">
      {/* HEADER */}
      <header className="top-header">
        <div className="logo-text">myup.uz</div>
        
        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <button className={\`desktop-nav-item \${activeTab === 'home' ? 'active' : ''}\`} onClick={() => handleTabChange('home')}>
            <Search size={18} /> <span>Qidiruv</span>
          </button>
          <button className={\`desktop-nav-item \${activeTab === 'map' ? 'active' : ''}\`} onClick={() => handleTabChange('map')}>
            <Map size={18} /> <span>Xarita</span>
          </button>
          <button className={\`desktop-nav-item \${activeTab === 'services' ? 'active' : ''}\`} onClick={() => handleTabChange('services')}>
            <Settings size={18} /> <span>Xizmatlar</span>
          </button>
          <button className={\`desktop-nav-item \${activeTab === 'profile' ? 'active' : ''}\`} onClick={() => handleTabChange('profile')}>
            <User size={18} /> <span>Profil</span>
          </button>
          <button className="desktop-nav-item" onClick={() => setShowSettingsModal(true)}>
            <Settings size={18} /> <span>Sozlamalar</span>
          </button>
        </nav>
        
        {/* Mobile Profile Btn */}
        <button className="mobile-profile-btn">
          <User size={20} />
        </button>
      </header>

      <div className="app-content">
        {/* LEFT PANEL / MOBILE MAIN */}
        <div className="left-panel" style={{ display: (activeTab === 'home' || activeTab === 'search') ? 'flex' : 'none' }}>
          
          {/* FUEL TYPE GRID */}
          <div className="fuel-filters-grid">
            <button 
              className={\`fuel-btn \${fuelSubFilter === 'metan' ? 'active' : ''}\`} 
              onClick={() => { setActiveCategory('fuel'); setFuelSubFilter('metan'); }}
            >
              <Fuel className="fuel-icon" size={20} /> Metan Gaz
            </button>
            <button 
              className={\`fuel-btn \${fuelSubFilter === 'benzin' ? 'active' : ''}\`} 
              onClick={() => { setActiveCategory('fuel'); setFuelSubFilter('benzin'); }}
            >
              <Droplets className="fuel-icon" size={20} /> Benzin
            </button>
            <button 
              className={\`fuel-btn \${fuelSubFilter === 'propan' ? 'active' : ''}\`} 
              onClick={() => { setActiveCategory('fuel'); setFuelSubFilter('propan'); }}
            >
              <Flame className="fuel-icon" size={20} /> Propan
            </button>
            <button 
              className={\`fuel-btn \${fuelSubFilter === 'elektr' ? 'active' : ''}\`} 
              onClick={() => { setActiveCategory('fuel'); setFuelSubFilter('elektr'); }}
            >
              <Zap className="fuel-icon" size={20} /> Elektr Zaryadlash
            </button>
          </div>

          {/* SORT PILLS */}
          <div className="sort-pills-scroll">
            <button 
              className={\`sort-pill \${fuelSortBy === 'nearest' ? 'active' : ''}\`}
              onClick={() => setFuelSortBy('nearest')}
            >Eng Yaqin</button>
            <button 
              className={\`sort-pill \${fuelSortBy === 'nearest_best' ? 'active' : ''}\`}
              onClick={() => setFuelSortBy('nearest_best')}
            >Eng Sifatli</button>
            <button 
              className={\`sort-pill \${fuelSortBy === 'cheapest' ? 'active' : ''}\`}
              onClick={() => setFuelSortBy('cheapest')}
            >Eng Arzon</button>
          </div>

          {/* LIST */}
          <div className="station-list">
            {filteredStations.map(station => (
              <StationCard
                key={station.id}
                station={station}
                userDistance={station.calculatedDistance}
                isFavorite={favorites.includes(station.id)}
                onToggleFavorite={null} // Update logic if needed
                onSelectStation={setSelectedStation}
              />
            ))}
            
            {/* MOBILE MAP PREVIEW */}
            <div className="mobile-map-preview" onClick={() => handleTabChange('map')}>
              <div className="mmp-text">
                <h3>Xaritada ko'rish</h3>
                <p>Top un Karitadi korls.</p>
              </div>
              <div className="mmp-image">
                <img src="/map-preview.jpg" alt="Map" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL MAP (Desktop) */}
        <div className="right-panel-map" style={{ display: activeTab === 'map' ? 'block' : '' }}>
          <MapView />
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      {window.innerWidth < 1024 && (
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
      )}
    </div>
  );

  `;

fs.writeFileSync(jsxPath, beforeReturn + newReturn + '\n  ' + afterReturn, 'utf8');
console.log("Updated App.jsx UI layout!");
