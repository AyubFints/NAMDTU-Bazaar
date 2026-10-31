const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx.bak', 'utf8');
const lines = content.split('\n');

const homeStart = lines.findIndex(l => l.includes('{activeTab === \'home\' && ('));
const searchStart = lines.findIndex(l => l.includes('{activeTab === \'search\' && ('));
const myStart = lines.findIndex(l => l.includes('{activeTab === \'my\' && !user && ('));

console.log({ homeStart, searchStart, myStart });
