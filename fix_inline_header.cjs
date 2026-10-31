const fs = require('fs');
const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add missing lucide-react imports for Home, Search, Map, User if not present
if (!content.includes('Home, Search, Map, User')) {
  // We'll just replace 'Settings' with 'Settings, Home, Search, Map, User'
  content = content.replace(/Settings(\s*\} from 'lucide-react')/, 'Settings, Home, Search, Map, User$1');
}

// 2. Locate the home-brand-bar and modify it
const oldBrandBar = `<div className="home-brand-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>`;

const newBrandBar = `<div className="home-brand-bar" style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '10px 20px', margin: '15px 20px', 
            background: '#f0f3f6', borderRadius: '25px',
            boxShadow: '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
            position: 'relative', zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => handleTabChange('home')}>`;

content = content.replace(oldBrandBar, newBrandBar);

// 3. Add desktop-nav right after the h1 closes.
const h1End = `</h1>
            </div>`;

const desktopNavHTML = `</h1>
            </div>

            {/* DESKTOP NAVIGATION */}
            <nav className="desktop-nav">
              <button 
                className={\`desktop-nav-item \${activeTab === 'home' ? 'active' : ''}\`}
                onClick={() => handleTabChange('home')}
              >
                <Home size={20} className="desktop-nav-icon" />
                <span>Home</span>
              </button>
              <button 
                className={\`desktop-nav-item \${activeTab === 'search' ? 'active' : ''}\`}
                onClick={() => handleTabChange('search')}
              >
                <Search size={20} className="desktop-nav-icon" />
                <span>Qidiruv</span>
              </button>
              <button 
                className={\`desktop-nav-item \${activeTab === 'map' ? 'active' : ''}\`}
                onClick={() => handleTabChange('map')}
              >
                <Map size={20} className="desktop-nav-icon" />
                <span>Xarita</span>
              </button>
              <button 
                className={\`desktop-nav-item \${activeTab === 'my' ? 'active' : ''}\`}
                onClick={() => handleTabChange('my')}
              >
                <User size={20} className="desktop-nav-icon" />
                <span>My</span>
              </button>
            </nav>
`;

content = content.replace(h1End, desktopNavHTML);
fs.writeFileSync(appPath, content, 'utf8');
console.log("Updated App.jsx inline header!");
