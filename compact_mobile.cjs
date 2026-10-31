const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

const regex = /\{\/\* Prices Row \(Compact\) \*\/\}[\s\S]*?(?=<div className="hsc-neu-split-left">)/m;

const newText = `{/* Prices Row (Compact) */}
      {station.prices && Object.keys(station.prices).length > 0 && (
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', marginBottom: '2px', marginLeft: '26px' }}>
          {Object.entries(station.prices).map(([key, value]) => {
             let label = key;
             if (key === 'metan') label = 'Metan';
             if (key === 'propan') label = 'Propan';
             if (key === 'benzin' || key === 'ai92' || key === 'ai80') label = 'Benzin';
             if (key === 'elektr') label = 'Elektr';
             return (
               <div key={key} style={{ display: 'inline-block', marginRight: '15px' }}>
                 {label}: <strong style={{color: '#0ea5e9'}}>{value.toLocaleString()} so'm</strong>
               </div>
             );
          })}
        </div>
      )}

      {/* Split Section: Distance & Status on left, Map on right */}
      <div className="hsc-neu-split-section" style={{ marginTop: '-8px', alignItems: 'center' }}>
        `;

content = content.replace(regex, newText);

// Also pull the map up a bit
content = content.replace(
  /<div className="hsc-neu-split-right">/,
  '<div className="hsc-neu-split-right" style={{ transform: "translateY(-5px)" }}>'
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Compacted the UI for mobile!");
