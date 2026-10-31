const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const regex = /\{\/\* Prices Row \*\/\}\s*\{station\.prices && Object\.keys\(station\.prices\)\.length > 0 && \([\s\S]*?<\/div>\s*\)\}/;

const newTextPrices = `{/* Prices Row (Simple Text) */}
      {station.prices && Object.keys(station.prices).length > 0 && (
        <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 4px' }}>
          {Object.entries(station.prices).map(([key, value]) => {
             let label = key;
             if (key === 'metan') label = 'Metan (Gaz)';
             if (key === 'propan') label = 'Propan';
             if (key === 'benzin' || key === 'ai92' || key === 'ai80') label = 'Benzin';
             if (key === 'elektr') label = 'Elektr';
             return (
               <div key={key}>
                 <span style={{color: '#64748b'}}>Yoqilg'i narxi ({label}):</span> <strong style={{color: '#0ea5e9'}}>{value.toLocaleString()} so'm</strong>
               </div>
             );
          })}
        </div>
      )}`;

content = content.replace(regex, newTextOrt);
// Wait, variable name error! 'newTextOrt' -> 'newTextPrices'
content = content.replace(regex, newTextPrices);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Replaced pills with simple text prices!");
