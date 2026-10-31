const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/AddStationModal.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// 1. Add fuelPrices state
content = content.replace(
  /const \[selectedTypes, setSelectedTypes\] = useState\(\[\]\);/,
  `const [selectedTypes, setSelectedTypes] = useState([]);
    const [fuelPrices, setFuelPrices] = useState({});`
);

// 2. Clear fuelPrices on close
content = content.replace(
  /setSelectedTypes\(\[\]\);/,
  `setSelectedTypes([]);
        setFuelPrices({});`
);

// 3. Add prices inputs in Step 3
const step3InputsRegex = /<\/div>\s*<\/div>\s*<div className="neu-form-group"/;
const step3InputsReplacement = `</div>
              </div>

              {selectedTypes.length > 0 && (
                <div style={{marginTop:'20px', marginBottom: '20px'}}>
                  <h4 style={{fontSize:'14px', color:'#334155', marginBottom:'10px'}}>Yoqilg'i narxlarini kiriting:</h4>
                  {selectedTypes.map(typeId => {
                    const label = FUEL_TYPES.find(f => f.id === typeId)?.label || typeId;
                    return (
                      <div key={typeId} className="neu-form-group" style={{marginBottom:'10px'}}>
                        <div className="neu-input-wrapper">
                          <input 
                            type="number" 
                            className="neu-input" 
                            placeholder={\`\${label} narxi (so'm)\`}
                            value={fuelPrices[typeId] || ''}
                            onChange={(e) => setFuelPrices({...fuelPrices, [typeId]: e.target.value})}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="neu-form-group"`;
              
content = content.replace(step3InputsRegex, step3InputsReplacement);

// 4. Update handleSubmit to include prices
const handleSubmitRegex = /type: selectedTypes,\s*phone,/;
const handleSubmitReplacement = `type: selectedTypes,
        prices: Object.fromEntries(
          Object.entries(fuelPrices)
            .map(([k, v]) => [k, parseInt(v)])
            .filter(([k, v]) => !isNaN(v) && v > 0)
        ),
        phone,`;
        
content = content.replace(handleSubmitRegex, handleSubmitReplacement);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Added price inputs to AddStationModal!");
