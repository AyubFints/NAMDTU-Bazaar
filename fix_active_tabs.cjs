const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/className="desktop-nav-item"/g, 'className={`desktop-nav-item ${activeTab === "REPLACE_ME" ? "active" : ""}`}');
content = content.replace(/REPLACE_ME"\s*\?\s*"active"\s*:\s*""\}`\}\s*onClick=\{\(\) => handleTabChange\("search"\)/, 'search" ? "active" : ""}`} onClick={() => handleTabChange("search")');
content = content.replace(/REPLACE_ME"\s*\?\s*"active"\s*:\s*""\}`\}\s*onClick=\{\(\) => handleTabChange\("map"\)/, 'map" ? "active" : ""}`} onClick={() => handleTabChange("map")');
content = content.replace(/REPLACE_ME"\s*\?\s*"active"\s*:\s*""\}`\}\s*onClick=\{\(\) => alert\("Xizmatlar/, 'services" ? "active" : ""}`} onClick={() => alert("Xizmatlar');
content = content.replace(/REPLACE_ME"\s*\?\s*"active"\s*:\s*""\}`\}\s*onClick=\{\(\) => handleTabChange\("my"\)/, 'my" ? "active" : ""}`} onClick={() => handleTabChange("my")');
content = content.replace(/REPLACE_ME"\s*\?\s*"active"\s*:\s*""\}`\}\s*onClick=\{\(\) => setShowSettingsModal\(/, 'settings" ? "active" : ""}`} onClick={() => setShowSettingsModal(');

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx desktop active tab logic updated');
