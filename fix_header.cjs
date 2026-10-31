const fs = require('fs');

const origPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(origPath, 'utf8');

// 1. Lift the <header> block OUT of the home tab.
const headerStart = content.indexOf('<header className="top-header">');
const headerEnd = content.indexOf('</header>') + 9;

if (headerStart !== -1) {
    const headerBlock = content.substring(headerStart, headerEnd);

    // Remove the header from its current position
    content = content.substring(0, headerStart) + content.substring(headerEnd);

    // Find `{activeTab === "home" && (` 
    const homeTabStart = content.indexOf('{activeTab === "home" && (');
    // Insert the header RIGHT BEFORE `homeTabStart`
    content = content.substring(0, homeTabStart) + '\n      {/* NEW GLOBAL DARK HEADER */}\n      ' + headerBlock + '\n\n      ' + content.substring(homeTabStart);
}

fs.writeFileSync(origPath, content, 'utf8');

let lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('home-brand-bar'));

if (idx !== -1) {
    let count = 0;
    let endIdx = -1;
    for (let i = idx - 2; i < lines.length; i++) { 
        if (lines[i].includes('<div')) count += (lines[i].match(/<div/g) || []).length; 
        if (lines[i].includes('</div')) count -= (lines[i].match(/<\/div/g) || []).length; 
        if (count === 0 && i >= idx) { 
            endIdx = i; 
            break; 
        } 
    } 
    
    if (endIdx !== -1) {
        lines.splice(idx - 2, endIdx - (idx - 2) + 1);
        fs.writeFileSync(origPath, lines.join('\n'), 'utf8');
        console.log("Header lifted and old brand bar removed successfully!");
    } else {
        console.log("Could not find end of brand bar.");
    }
} else {
    console.log("Could not find home-brand-bar.");
}
