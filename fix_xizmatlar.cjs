const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Ensure Menu is imported
if (!content.includes('Menu,')) {
    content = content.replace(/import \{/, 'import { Menu, ');
}

// Insert Xizmatlar between Xarita and Profil
const xaritaButton = `<button
            className="desktop-nav-item"
            onClick={() => handleTabChange("map")}
          >
            <Map size={18} className="desktop-nav-icon" />
            <span>Xarita</span>
          </button>`;

const xizmatlarButton = `          <button
            className="desktop-nav-item"
            onClick={() => alert("Xizmatlar hozircha tayyor emas")}
          >
            <Menu size={18} className="desktop-nav-icon" />
            <span>Xizmatlar</span>
          </button>`;

if (content.includes(xaritaButton)) {
    content = content.replace(xaritaButton, xaritaButton + '\n' + xizmatlarButton);
} else {
    // try a more fuzzy match
    const xaritaFuzzy = content.match(/<button[\s\S]*?onClick=\{\(\) => handleTabChange\("map"\)\}[\s\S]*?<span>Xarita<\/span>[\s\S]*?<\/button>/);
    if (xaritaFuzzy) {
        content = content.replace(xaritaFuzzy[0], xaritaFuzzy[0] + '\n' + xizmatlarButton);
    } else {
        console.log("Could not find Xarita button to insert Xizmatlar");
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx updated with Xizmatlar');
