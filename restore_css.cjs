const fs = require('fs');
const oldCss = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.css.bak', 'utf8');
let newCss = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.css', 'utf8');

// Rename my dark variables
newCss = newCss.replace(/--bg-color:/g, '--dark-bg:');
newCss = newCss.replace(/--text-main:/g, '--dark-text-main:');
newCss = newCss.replace(/--text-muted:/g, '--dark-text-muted:');

// Replace usage in newCss
newCss = newCss.replace(/var\(--bg-color\)/g, 'var(--dark-bg)');
newCss = newCss.replace(/var\(--text-main\)/g, 'var(--dark-text-main)');
newCss = newCss.replace(/var\(--text-muted\)/g, 'var(--dark-text-muted)');

// The new body rule overrides global. Let's make it specific to .dark-theme or .app-content
newCss = newCss.replace(/body\s*\{[^}]+\}/, `
body {
  /* Restored from old CSS */
}
.app-content {
  font-family: 'Inter', sans-serif;
  background-color: var(--dark-bg);
  color: var(--dark-text-main);
}
.top-header {
  background-color: var(--dark-bg);
}
`);

// Add margin to app-content on desktop
newCss += `
@media (min-width: 1024px) {
  .app-content {
    max-width: 1400px;
    margin: 0 auto;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
}
`;

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.css', oldCss + '\n/* NEW DARK STYLES */\n' + newCss, 'utf8');
console.log('App.css merged');
