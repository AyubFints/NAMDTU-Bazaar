const fs = require('fs');
const headerPath = 'C:/Users/user/Desktop/MyUp/src/components/Header.jsx';
let headerContent = fs.readFileSync(headerPath, 'utf8');

// Update imports
headerContent = headerContent.replace(
  /import \{ \n  Search, MapPin, Moon, Sun, User as UserIcon, PlusCircle, \n  Fuel, Sparkles, Navigation, Bookmark, Heart\n\} from 'lucide-react';/,
  `import { 
  Search, MapPin, Moon, Sun, User as UserIcon, PlusCircle, 
  Fuel, Sparkles, Navigation, Bookmark, Heart, Home, Map, User
} from 'lucide-react';`
);

// Update brand click
headerContent = headerContent.replace(
  /<div className="brand-section" onClick=\{\(\) => setActiveTab\('fuel'\)\} style=\{\{ cursor: 'pointer' \}\}>/,
  `<div className="brand-section" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>`
);

// Add Desktop Nav
const desktopNavStr = `
        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-nav">
          <button 
            className={\`desktop-nav-item \${activeTab === 'home' ? 'active' : ''}\`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} className="desktop-nav-icon" />
            <span>Home</span>
          </button>
          <button 
            className={\`desktop-nav-item \${activeTab === 'search' ? 'active' : ''}\`}
            onClick={() => setActiveTab('search')}
          >
            <Search size={20} className="desktop-nav-icon" />
            <span>Qidiruv</span>
          </button>
          <button 
            className={\`desktop-nav-item \${activeTab === 'map' ? 'active' : ''}\`}
            onClick={() => setActiveTab('map')}
          >
            <Map size={20} className="desktop-nav-icon" />
            <span>Xarita</span>
          </button>
          <button 
            className={\`desktop-nav-item \${activeTab === 'my' ? 'active' : ''}\`}
            onClick={() => setActiveTab('my')}
          >
            <User size={20} className="desktop-nav-icon" />
            <span>My</span>
          </button>
        </nav>
`;

headerContent = headerContent.replace(
  /<\/div>\s*\{\/\* SEARCH BAR \*\/\}/,
  `</div>\n${desktopNavStr}\n\n        {/* SEARCH BAR */}`
);

fs.writeFileSync(headerPath, headerContent, 'utf8');

// App.css updates
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const cssAdditions = `
/* HEADER NEUMORPHISM */
.app-header {
  background: #f0f3f6 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
  border-bottom: none !important;
}

/* DESKTOP NAVIGATION (Next to Logo) */
.desktop-nav {
  display: flex;
  align-items: center;
  background: #f0f3f6;
  border-radius: 40px;
  box-shadow: 5px 5px 10px #d1d5db, -5px -5px 10px #ffffff;
  padding: 4px;
  margin-left: 20px;
  gap: 5px;
}
.desktop-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  cursor: pointer;
  color: #64748b;
  font-weight: 600;
  font-size: 11px;
  transition: all 0.2s ease;
}
.desktop-nav-item.active {
  background: #e0f2fe;
  color: #0ea5e9;
  box-shadow: inset 3px 3px 6px #bae6fd, inset -3px -3px 6px #ffffff;
}
.desktop-nav-icon {
  margin-bottom: 2px;
}

/* Hide BottomNav on Desktop, Hide DesktopNav on Mobile */
@media (min-width: 769px) {
  .bottom-nav-bar {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .desktop-nav {
    display: none !important;
  }
}
`;

cssContent += cssAdditions;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Desktop Nav in Header added!");
