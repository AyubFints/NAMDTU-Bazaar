const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/<h1>myup\.uz<\/h1>/, '<h1>myup.<span style={{color: "#38bdf8"}}>uz</span></h1>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx logo updated');
