const fs = require('fs');
let css = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.css', 'utf8');

// Find and replace the old neumorphic desktop-nav block that has the white pill background
// It contains: background: #f0f3f6; border-radius: 40px; box-shadow: ...
const oldNavBlock = css.substring(
  css.indexOf('/* DESKTOP NAVIGATION'),
  css.indexOf('.desktop-nav-item {', css.indexOf('/* DESKTOP NAVIGATION'))
);

if (oldNavBlock) {
  const newNavBlock = `/* DESKTOP NAVIGATION (Next to Logo) */
.desktop-nav {
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin-left: 0;
  gap: 4px;
}
`;
  css = css.replace(oldNavBlock, newNavBlock);
  console.log('Old neumorphic desktop-nav replaced!');
} else {
  console.log('Could not find old nav block');
}

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.css', css, 'utf8');
