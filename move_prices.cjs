const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// 1. Remove old price row
const oldPriceRegex = /\{\/\* Prices Row \(Simple Text\) \*\/\}[\s\S]*?<\/div>\s*\)\}/m;
content = content.replace(oldPriceRegex, '');

// 2. Insert compact price row after address
const addressEndRegex = /(<div className="hsc-neu-address-row">[\s\S]*?<\/div>)/m;

const newPriceBlock = `$1

      {/* Prices Row (Compact) */}
      {station.prices && Object.keys(station.prices).length > 0 && (
        <div style={{ fontSize: '0.8rem', color: '#64748b', padding: '0 12px', marginBottom: '12px', marginTop: '-2px' }}>
          {Object.entries(station.prices).map(([key, value]) => {
             let label = key;
             if (key === 'metan') label = 'Metan';
             if (key === 'propan') label = 'Propan';
             if (key === 'benzin' || key === 'ai92' || key === 'ai80') label = 'Benzin';
             if (key === 'elektr') label = 'Elektr';
             return (
               <div key={key} style={{ display: 'inline-block', marginRight: '15px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '8px' }}>
                 {label}: <strong style={{color: '#0ea5e9'}}>{value.toLocaleString()} so'm</strong>
               </div>
             );
          })}
        </div>
      )}`;

content = content.replace(addressEndRegex, newPriceBlock);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Moved prices under address and made compact!");
