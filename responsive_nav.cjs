const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const responsiveCSS = `
/* MOBILE RESPONSIVE HEADER NAV */
@media (max-width: 768px) {
  .home-brand-bar {
    padding: 8px 10px !important;
    margin: 10px 5px !important;
    border-radius: 20px !important;
  }
  .brand-logo-icon {
    width: 32px !important;
    height: 32px !important;
  }
  .home-brand-title {
    font-size: 1.1rem !important;
  }
  .desktop-nav {
    margin-left: 5px !important;
    padding: 2px !important;
    gap: 2px !important;
  }
  .desktop-nav-item {
    padding: 6px 8px !important;
    font-size: 9px !important;
    border-radius: 20px !important;
  }
  .desktop-nav-icon {
    width: 16px !important;
    height: 16px !important;
    margin-bottom: 2px !important;
  }
  
  /* Hide the old bottom nav since we now use the header nav on mobile too */
  .bottom-nav-bar {
    display: none !important;
  }
}
`;

if (!cssContent.includes('MOBILE RESPONSIVE HEADER NAV')) {
  cssContent += responsiveCSS;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log("Added mobile responsive CSS!");
} else {
  console.log("CSS already contains mobile responsive block.");
}
