const fs = require('fs');
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
.hsc-neu-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hsc-neu-rating-fav {
  display: flex;
  align-items: center;
  gap: 16px;
}
.hsc-neu-address-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.4;
  margin-top: -4px;
}
.hsc-neu-split-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
}
.hsc-neu-split-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.hsc-neu-distance-stacked {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.hsc-neu-dist-text {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.3;
}
.hsc-neu-split-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
`;

cssContent += newCSS;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("Updated CSS for new layout!");
