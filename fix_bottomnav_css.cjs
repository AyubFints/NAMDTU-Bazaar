const fs = require('fs');
let css = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.css', 'utf8');

// Remove old modern-bottom-nav block
const modernNavStart = css.indexOf('/* MODERN BOTTOM NAV');
if (modernNavStart !== -1) {
  css = css.substring(0, modernNavStart);
}

// Add new clean bottom nav CSS
const newNavCss = `
/* ===== MODERN BOTTOM NAV (matches screenshot 2) ===== */
.modern-bottom-nav.bottom-nav-bar {
  background: #f0f4f8;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 480px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  z-index: 1000;
  height: auto;
}

.modern-bottom-nav .bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.2s;
  min-width: 48px;
}

.modern-bottom-nav .bottom-nav-item:hover {
  color: #64748b;
}

.modern-bottom-nav .bottom-nav-item.active {
  color: #0ea5e9;
}

.modern-bottom-nav .bottom-nav-item.active::before {
  display: none;
}

.modern-bottom-nav .nav-icon {
  stroke-width: 1.75;
}
`;

css += newNavCss;
fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.css', css, 'utf8');
console.log('Bottom nav CSS updated!');
