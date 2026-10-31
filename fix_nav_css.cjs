const fs = require('fs');

const origPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(origPath, 'utf8');

// Replace global dark variables in .top-header
content = content.replace(/\.top-header \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/var\(--bg-color\)/g, '#0E0E10')
                  .replace(/var\(--border-color\)/g, '#333336');
    return `.top-header {${newP1}}`;
});

content = content.replace(/\.logo h1 \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/var\(--text-main\)/g, '#FFFFFF');
    return `.logo h1 {${newP1}}`;
});

content = content.replace(/\.desktop-nav-item \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/var\(--text-muted\)/g, '#A0A0A5');
    return `.desktop-nav-item {${newP1}}`;
});

content = content.replace(/\.desktop-nav-item:hover \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/var\(--text-main\)/g, '#FFFFFF')
                  .replace(/var\(--panel-bg\)/g, '#1A1A1C');
    return `.desktop-nav-item:hover {${newP1}}`;
});

// Update Bottom Nav to be dark
content = content.replace(/\.bottom-nav-bar \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/background: var\(--bg-secondary\)/, 'background: #1A1A1C')
                  .replace(/border: 1px solid var\(--border-color\)/, 'border: 1px solid #333336');
    return `.bottom-nav-bar {${newP1}}`;
});

content = content.replace(/\.bottom-nav-item \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/color: var\(--text-secondary\)/, 'color: #A0A0A5');
    return `.bottom-nav-item {${newP1}}`;
});

content = content.replace(/\.bottom-nav-item\.active \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/color: var\(--primary-color\)/, 'color: #38bdf8');
    return `.bottom-nav-item.active {${newP1}}`;
});

content = content.replace(/\.bottom-nav-item\.active::before \{([\s\S]*?)\}/, (match, p1) => {
    let newP1 = p1.replace(/background-color: var\(--primary-color\)/, 'background-color: #38bdf8');
    return `.bottom-nav-item.active::before {${newP1}}`;
});

// Write it back
fs.writeFileSync(origPath, content, 'utf8');
console.log('App.css header and bottom nav hardcoded to dark!');
