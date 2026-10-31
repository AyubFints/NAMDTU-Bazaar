const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove Menu from mockData import
content = content.replace(/import\s*\{\s*Menu\s*,\s*/g, 'import { ');

// Add Menu to lucide-react import
const lucideImport = content.match(/import\s*\{[\s\S]*?\}\s*from\s*"lucide-react";/);
if (lucideImport) {
    if (!lucideImport[0].includes('Menu')) {
        content = content.replace('Fuel,', 'Menu,\n  Fuel,');
    }
} else {
    // If lucide-react is not imported like that, just add a new import
    content = content.replace('import React', 'import { Menu } from "lucide-react";\nimport React');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Imports fixed with Regex');
