const fs = require('fs');
const bottomNavPath = 'C:/Users/user/Desktop/MyUp/src/components/BottomNav.jsx';
let bottomContent = fs.readFileSync(bottomNavPath, 'utf8');

bottomContent = bottomContent.replace(/<span>Bosh sahifa<\/span>/, '<span>Asosiy</span>');

fs.writeFileSync(bottomNavPath, bottomContent, 'utf8');

const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

appContent = appContent.replace(/<span>Bosh sahifa<\/span>/g, '<span>Asosiy</span>');

fs.writeFileSync(appPath, appContent, 'utf8');

console.log("Changed 'Bosh sahifa' to 'Asosiy'!");
