const fs = require('fs');
const bottomNavPath = 'C:/Users/user/Desktop/MyUp/src/components/BottomNav.jsx';
let bottomContent = fs.readFileSync(bottomNavPath, 'utf8');

bottomContent = bottomContent.replace(/<span>Home<\/span>/, '<span>Bosh sahifa</span>');
bottomContent = bottomContent.replace(/<span>My<\/span>/, '<span>Profilim</span>');

fs.writeFileSync(bottomNavPath, bottomContent, 'utf8');

const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

appContent = appContent.replace(/<span>Home<\/span>/g, '<span>Bosh sahifa</span>');
appContent = appContent.replace(/<span>My<\/span>/g, '<span>Profilim</span>');

fs.writeFileSync(appPath, appContent, 'utf8');

console.log("Updated navigation labels!");
