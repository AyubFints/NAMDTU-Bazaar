const fs = require('fs');
const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove activeTab === 'my' && around the settings button and add mobile-settings-btn class
const oldSettingsBtn = `{activeTab === 'my' && (
              <button 
                onClick={() => setShowSettingsModal(true)}
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s ease' }}
              >
                <Settings size={24} />
              </button>
            )}`;

const newSettingsBtn = `<button 
                className="mobile-settings-btn"
                onClick={() => setShowSettingsModal(true)}
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s ease' }}
              >
                <Settings size={24} />
              </button>`;
content = content.replace(oldSettingsBtn, newSettingsBtn);
// In case the spacing was different, we can also use regex
if (!content.includes('mobile-settings-btn')) {
    content = content.replace(
        /\{activeTab === 'my' && \(\s*<button\s+onClick=\{\(\) => setShowSettingsModal\(true\)\}\s+style=\{\{[^}]+\}\}\s*>\s*<Settings size=\{24\} \/>\s*<\/button>\s*\)\}/,
        newSettingsBtn
    );
}

// 2. Add the Settings button to desktop-nav
const desktopMyBtn = `<button 
                className={\`desktop-nav-item \${activeTab === 'my' ? 'active' : ''}\`}
                onClick={() => handleTabChange('my')}
              >
                <User size={20} className="desktop-nav-icon" />
                <span>My</span>
              </button>`;

const newDesktopBtns = `${desktopMyBtn}
              <button 
                className="desktop-nav-item"
                onClick={() => alert('Hozircha ustida ishlamoqdamiz')}
              >
                <Settings size={20} className="desktop-nav-icon" />
                <span>Nastroyka</span>
              </button>`;

content = content.replace(desktopMyBtn, newDesktopBtns);

fs.writeFileSync(appPath, content, 'utf8');

const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const mobileSettingsCss = `
/* HIDE MOBILE SETTINGS BTN ON DESKTOP */
@media (min-width: 769px) {
  .mobile-settings-btn {
    display: none !important;
  }
}
`;
if (!cssContent.includes('.mobile-settings-btn')) {
  cssContent += mobileSettingsCss;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}

console.log("Updated App.jsx and App.css for settings buttons!");
