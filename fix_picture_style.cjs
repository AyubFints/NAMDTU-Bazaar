const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

content = content.replaceAll(
  '<picture>',
  '<picture style={{ display: "block", width: "100%", height: "100%" }}>'
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Updated picture style!");
