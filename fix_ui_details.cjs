const fs = require('fs');

// 1. Fix the text opacity in AddStationModal
const modalPath = 'C:/Users/user/Desktop/MyUp/src/components/AddStationModal.jsx';
let modalContent = fs.readFileSync(modalPath, 'utf8');

modalContent = modalContent.replace(
  /<div style=\{\{marginTop:'15px', textAlign:'center', opacity:0.6\}\}>\s*<span style=\{\{color:'#64748b', fontSize: '13px'\}\}>Boshqa manzillar ustida ishlanmoqda\.\.\.<\/span>/g,
  `<div style={{marginTop:'15px', textAlign:'center'}}>\n                <span style={{color:'#334155', fontSize: '13px', fontWeight: '500'}}>Boshqa manzillar ustida ishlanmoqda...</span>`
);

fs.writeFileSync(modalPath, modalContent, 'utf8');

// 2. Fix the disabled button CSS in App.css
const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Overwrite the :disabled state of neu-submit-btn globally so it looks white/neumorphic
cssContent += `
.neu-submit-btn:disabled {
  background: #f0f3f6 !important;
  color: #94a3b8 !important;
  box-shadow: 6px 6px 12px #d1d5db, -6px -6px 12px #ffffff !important;
  cursor: not-allowed !important;
}
`;

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Fixed text opacity and disabled button color!');
