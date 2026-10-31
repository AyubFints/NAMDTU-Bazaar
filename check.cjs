const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if(l.includes('activeTab === "map"')) console.log((i-2) + ' to ' + (i+5) + ':\n' + lines.slice(i-2, i+5).join('\n'));
});
