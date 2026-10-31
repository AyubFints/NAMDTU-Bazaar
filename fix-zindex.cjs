const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/(\.top-header\s*\{[^}]*?position:\s*sticky;\s*top:\s*0;\s*z-index:\s*)\d+([^}]*?\})/g, '$12000$2');
css = css.replace(/(\.mobile-header\s*\{[^}]*?position:\s*sticky;\s*top:\s*0;\s*z-index:\s*)\d+([^}]*?\})/g, '$12000$2');
fs.writeFileSync(cssPath, css);
console.log('Fixed z-index');
