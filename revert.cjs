const fs = require('fs');
const path = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(path, 'utf8');

// Revert auth-neu-container display/alignment back to center
content = content.replace(/display: block;\s*justify-content: center;\s*align-items: flex-start;\s*padding: 40px 20px;/g, 'display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 20px;');

// Revert margin 40px auto from auth-neu-card
content = content.replace(/\.auth-neu-card \{\s*margin: 40px auto;/g, '.auth-neu-card {');

fs.writeFileSync(path, content, 'utf8');
console.log('Reverted styling');
