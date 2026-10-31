const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Remove my-3 which adds extra vertical margin
content = content.replace(/show my-3/g, 'show');

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Removed my-3 from map wrapper in JSX!");
