const fs = require('fs');
const filePath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let content = fs.readFileSync(filePath, 'utf8');

// Replace top-header style
content = content.replace(/\.top-header \{[\s\S]*?\}/, `.top-header {
  height: 60px;
  background-color: #1a1a1c !important;
  border-bottom: 1px solid #2a2a2c !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: none !important;
}`);

// Replace desktop-nav-item style
content = content.replace(/\.desktop-nav-item \{[\s\S]*?\}/, `.desktop-nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.88rem;
  gap: 6px;
  transition: all 0.2s ease;
}`);

content = content.replace(/\.desktop-nav-item:hover \{[\s\S]*?\}/, `.desktop-nav-item:hover {
  color: #ffffff !important;
  background-color: rgba(255,255,255,0.06) !important;
}`);

content = content.replace(/\.desktop-nav-item\.active \{[\s\S]*?\}/, `.desktop-nav-item.active {
  color: #38bdf8 !important;
  background-color: transparent !important;
}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.css header colors updated');
