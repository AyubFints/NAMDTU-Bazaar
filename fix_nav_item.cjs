const fs = require('fs');
let css = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.css', 'utf8');

// Override desktop-nav-item color for dark header visibility
// Find the existing .desktop-nav-item block and replace the color
css = css.replace(
  /\.desktop-nav-item \{\s*display: flex;\s*flex-direction: column;\s*align-items: center;\s*justify-content: center;\s*background: transparent;\s*border: none;\s*border-radius: 30px;\s*padding: 8px 16px;\s*cursor: pointer;\s*color: #64748b;\s*font-weight: 600;\s*font-size: 11px;\s*transition: all 0\.2s ease;\s*\}/,
  `.desktop-nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  color: #a0aec0;
  font-weight: 500;
  font-size: 0.88rem;
  gap: 6px;
  transition: all 0.2s ease;
}`
);

// Fix active state for dark header
css = css.replace(
  /\.desktop-nav-item\.active \{[\s\S]*?box-shadow:[\s\S]*?\}/,
  `.desktop-nav-item.active {
  background: rgba(255,255,255,0.08);
  color: #ffffff;
}`
);

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.css', css, 'utf8');
console.log('desktop-nav-item styles fixed for dark header!');
