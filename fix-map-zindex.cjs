const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/components/MapView.jsx';
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/\.locate-me-btn\s*\{\s*position:\s*absolute;\s*bottom:\s*24px;\s*right:\s*16px;\s*z-index:\s*1000;/g, '.locate-me-btn { position: absolute; bottom: 24px; right: 16px; z-index: 900;');
content = content.replace(/\.map-status-banner\s*\{([\s\S]*?)z-index:\s*1000;/g, '.map-status-banner {$1z-index: 900;');
content = content.replace(/\.map-accuracy-badge\s*\{([\s\S]*?)z-index:\s*1000;/g, '.map-accuracy-badge {$1z-index: 900;');
fs.writeFileSync(filePath, content);
console.log('Fixed MapView.jsx z-index');
