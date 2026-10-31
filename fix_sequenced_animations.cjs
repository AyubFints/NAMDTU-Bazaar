const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Remove any existing .smooth-transition blocks if possible
cssContent = cssContent.replace(/\.smooth-transition\s*\{[^}]+\}/g, '');
cssContent = cssContent.replace(/\.smooth-transition\.hide\s*\{[^}]+\}/g, '');
cssContent = cssContent.replace(/\.smooth-transition\.show\s*\{[^}]+\}/g, '');
cssContent = cssContent.replace(/\.fuel-filters-wrapper\.smooth-transition\.show\s*\{[^}]+\}/g, '');

const newTransitionCSS = `
/* ENHANCED ANIMATIONS FOR MAP AND FILTERS */
.smooth-transition {
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, margin 0.4s ease-in-out, padding 0.4s ease-in-out;
  overflow: hidden;
}
.smooth-transition.hide {
  opacity: 0 !important;
  max-height: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  pointer-events: none !important;
  transform: scaleY(0);
  transform-origin: top;
}
.smooth-transition.show {
  opacity: 1 !important;
  max-height: 400px !important; /* enough for map or filters */
  pointer-events: auto !important;
  transform: scaleY(1);
  transform-origin: top;
}

/* Delay the fuel filters so map has time to disappear */
.fuel-filters-wrapper.smooth-transition.show {
  transition-delay: 0.3s;
}
`;

cssContent += newTransitionCSS;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Updated smooth transitions for sequenced animations!");
