const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// find desktop-nav block
const navStart = content.indexOf('<nav className="desktop-nav">');
const navEnd = content.indexOf('</nav>', navStart) + 6;

const newNav = `<nav className="desktop-nav">
          <button
            className={\`desktop-nav-item \${activeTab === "search" ? "active" : ""}\`}
            onClick={() => handleTabChange("search")}
          >
            <Search size={18} className="desktop-nav-icon" />
            <span>Qidiruv</span>
          </button>
          <button
            className={\`desktop-nav-item \${activeTab === "map" ? "active" : ""}\`}
            onClick={() => handleTabChange("map")}
          >
            <Map size={18} className="desktop-nav-icon" />
            <span>Xarita</span>
          </button>
          <button
            className={\`desktop-nav-item \${activeTab === "services" ? "active" : ""}\`}
            onClick={() => alert("Xizmatlar hozircha tayyor emas")}
          >
            <Menu size={18} className="desktop-nav-icon" />
            <span>Xizmatlar</span>
          </button>
          <button
            className={\`desktop-nav-item \${activeTab === "my" ? "active" : ""}\`}
            onClick={() => handleTabChange("my")}
          >
            <User size={18} className="desktop-nav-icon" />
            <span>Profil</span>
          </button>
          <button
            className="desktop-nav-item"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings size={18} className="desktop-nav-icon" />
            <span>Sozlamalar</span>
          </button>
        </nav>`;

content = content.substring(0, navStart) + newNav + content.substring(navEnd);
fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx desktop active tab logic fully replaced');
