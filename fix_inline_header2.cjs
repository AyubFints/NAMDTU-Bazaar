const fs = require('fs');
const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Replace the home-brand-bar styling
content = content.replace(
  /<div className="home-brand-bar"[^>]*>/,
  `<div className="home-brand-bar" style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '10px 20px', margin: '15px 20px', 
            background: '#f0f3f6', borderRadius: '25px',
            boxShadow: '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
            position: 'relative', zIndex: 10
          }}>`
);

// 2. Make the logo clickable
content = content.replace(
  /<div style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'8px'\s*\}\}>/,
  `<div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => handleTabChange('home')}>`
);

// 3. Inject the desktop-nav right before the activeTab === 'my' check (or after the logo div)
const navToInject = `
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

content = content.replace(
  /(<\/h1>\s*<\/div>)/,
  `$1${navToInject}`
);

fs.writeFileSync(appPath, content, 'utf8');
console.log("Injected desktop-nav using regex replacements!");
