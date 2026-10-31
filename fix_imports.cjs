const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the imports
content = content.replace('import { Menu, CITIES, INITIAL_STATIONS } from "./data/mockData";', 'import { CITIES, INITIAL_STATIONS } from "./data/mockData";');
content = content.replace('import {', 'import { Menu,');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Imports fixed in App.jsx');
