const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

content = content.replace(
  /<div className="hsc-neu-status closed">\s*Yopiq\s*<\/div>/,
  `<div className="hsc-neu-status closed">
                Yopiq {station.reopenTime && \` (\${station.reopenTime} da ochiladi)\`}
              </div>`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Added reopen time for closed stations!");
