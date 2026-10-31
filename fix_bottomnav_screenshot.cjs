const fs = require('fs');

const bottomNavJsx = `import React from 'react';
import { Search, Map, User, Navigation } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onOpenSettings }) {
  return (
    <nav className="bottom-nav-bar modern-bottom-nav">
      <button 
        className={\`bottom-nav-item \${activeTab === 'search' ? 'active' : ''}\`}
        onClick={() => setActiveTab('search')}
      >
        <Search size={22} className="nav-icon" />
        <span>Qidiruv</span>
      </button>

      <button 
        className={\`bottom-nav-item \${activeTab === 'map' ? 'active' : ''}\`}
        onClick={() => setActiveTab('map')}
      >
        <Map size={22} className="nav-icon" />
        <span>Xarita</span>
      </button>

      <button 
        className={\`bottom-nav-item \${activeTab === 'my' ? 'active' : ''}\`}
        onClick={() => setActiveTab('my')}
      >
        <User size={22} className="nav-icon" />
        <span>Profil</span>
      </button>

      <div className="bottom-nav-settings-wrapper">
        <button 
          className="bottom-nav-settings-btn"
          onClick={() => onOpenSettings && onOpenSettings()}
        >
          <div className="floating-circle">
            <Navigation size={24} className="nav-icon floating-icon" />
          </div>
          <span>Sozlamalar</span>
        </button>
      </div>
    </nav>
  );
}
`;

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/components/BottomNav.jsx', bottomNavJsx, 'utf8');

// Now update App.jsx to pass `onOpenSettings={() => setShowSettingsModal(true)}` to BottomNav
let appJsx = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx', 'utf8');
appJsx = appJsx.replace(/<BottomNav\s+activeTab=\{activeTab\}\s+setActiveTab=\{handleTabChange\}\s*\/>/g, '<BottomNav activeTab={activeTab} setActiveTab={handleTabChange} onOpenSettings={() => setShowSettingsModal(true)} />');
fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx', appJsx, 'utf8');

// Now we need to update the CSS in App.css for `.modern-bottom-nav`
const appCss = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.css', 'utf8');
const modernNavCss = `
/* MODERN BOTTOM NAV (Light rounded style from screenshot) */
.modern-bottom-nav.bottom-nav-bar {
  background: #f0f4f8; /* very light blue/grey */
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  height: auto;
}

.modern-bottom-nav .bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: none;
  border: none;
  color: #718096; /* grey-blue */
  font-size: 0.75rem;
  font-weight: 500;
}
.modern-bottom-nav .bottom-nav-item.active {
  color: #38bdf8;
}
.modern-bottom-nav .bottom-nav-item.active::before {
  display: none; /* remove old dot */
}
.modern-bottom-nav .nav-icon {
  stroke-width: 1.5;
}

.bottom-nav-settings-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bottom-nav-settings-btn {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #718096;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transform: translateY(-20px); /* Lift it up */
}

.bottom-nav-settings-btn .floating-circle {
  width: 50px;
  height: 50px;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.1);
  margin-bottom: 4px;
}

.bottom-nav-settings-btn .floating-icon {
  color: #0ea5e9; /* bright blue */
  fill: #0ea5e9;
  transform: rotate(45deg); /* To make it look like a paper plane/navigation if it's the send icon, but lucide Navigation is already angled. We will not rotate Navigation, Navigation looks right naturally. Wait, let's leave rotation 0 for now. */
}
`;

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.css', appCss + '\n\n' + modernNavCss, 'utf8');

console.log("BottomNav replaced with screenshot design!");
