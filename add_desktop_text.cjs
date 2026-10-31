const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

// Add the overlay text inside the compact-home-map-container
const replacement = `<img src="/map-preview.jpg" alt="Xarita" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                      <div className="desktop-only-map-text">Harita</div>`;
jsxContent = jsxContent.replace(/<img src="\/map-preview\.jpg" alt="Xarita" style=\{\{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' \}\} \/>/m, replacement);

fs.writeFileSync(jsxPath, jsxContent, 'utf8');

const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Add CSS for desktop-only-map-text
const cssAddition = `
.desktop-only-map-text {
  display: none;
}
@media (min-width: 769px) {
  .desktop-only-map-text {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 10px 24px;
    border-radius: 20px;
    font-size: 1.2rem;
    font-weight: 600;
    pointer-events: none;
  }
}
`;

cssContent += cssAddition;
fs.writeFileSync(cssPath, cssContent, 'utf8');

console.log("Added desktop-only map text!");
