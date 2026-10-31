const fs = require('fs');

const origPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(origPath, 'utf8');

// Change `.dark-theme-home .top-header` to just `.top-header`
content = content.replace(/\.dark-theme-home \.top-header/g, '.top-header');

// Also do it for .logo and .desktop-nav
content = content.replace(/\.dark-theme-home \.logo/g, '.logo');
content = content.replace(/\.dark-theme-home \.desktop-nav/g, '.desktop-nav');
content = content.replace(/\.dark-theme-home \.desktop-nav-item/g, '.desktop-nav-item');

fs.writeFileSync(origPath, content, 'utf8');
console.log('App.css header scoping fixed!');
