const fs = require('fs');

const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Change "Borish" to "Batafsil"
content = content.replace(
  />\s*Borish\s*<\/button>/,
  `>\n        Batafsil\n      </button>`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Changed button text to Batafsil!");
