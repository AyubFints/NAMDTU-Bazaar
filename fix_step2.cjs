const fs = require('fs');
const path = 'C:/Users/user/Desktop/MyUp/src/components/AddStationModal.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('HelpCircle', 'HelpCircle, Type');

const step2Regex = /<div className="neu-form-group" style=\{\{marginBottom:'20px'\}\}>[\s\S]*?Boshqa manzillar ustida ishlanmoqda\.\.\.<\/span>\s*<\/div>\s*<\/div>/;

const newStep2 = `<div className="neu-form-group" style={{marginBottom:'20px'}}>
              <div 
                className="neu-input-wrapper" 
                style={{cursor:'pointer', padding:'15px', display:'flex', alignItems:'center', gap:'10px',
                background: stationType === 'fuel' ? '#e2e8f0' : '#f0f3f6',
                boxShadow: stationType === 'fuel' ? 'inset 5px 5px 10px #cbd5e1, inset -5px -5px 10px #ffffff' : '5px 5px 10px #d1d5db, -5px -5px 10px #ffffff',
                border: '2px solid transparent'}}
                onClick={() => setStationType('fuel')}
              >
                <Fuel color={stationType === 'fuel' ? '#0ea5e9' : '#94a3b8'} />
                <span style={{fontWeight:'bold', color: stationType === 'fuel' ? '#0ea5e9' : '#334155'}}>Yoqilg'i shahobchasi</span>
              </div>
              
              <div style={{marginTop:'15px', textAlign:'center', opacity:0.6}}>
                <span style={{color:'#64748b', fontSize: '13px'}}>Boshqa manzillar ustida ishlanmoqda...</span>
              </div>
            </div>`;

content = content.replace(step2Regex, newStep2);
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Step 2 via regex!');
