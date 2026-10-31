const fs = require('fs');

const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// 1. Add onClick to the main card container
content = content.replace(
  /<div className="home-station-card-neu">/,
  `<div className="home-station-card-neu" onClick={() => onSelectStation(station)} style={{ cursor: 'pointer' }}>`
);

// 2. Stop propagation on the minimap ring
content = content.replace(
  /<div className="hsc-neu-minimap-ring">/,
  `<div className="hsc-neu-minimap-ring" onClick={(e) => e.stopPropagation()}>`
);

// 3. Change "Kirish" to "Borish"
content = content.replace(
  />\s*Kirish\s*<\/button>/,
  `>\n        Borish\n      </button>`
);

// 4. Ensure the button stops propagation so it doesn't trigger outer onClick twice (though it doesn't matter much)
content = content.replace(
  /<button className="hsc-neu-action-btn" onClick=\{\(e\) => \{/,
  `<button className="hsc-neu-action-btn" onClick={(e) => {`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Updated StationCard click handlers and button text!");
