const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Add states
if (!content.includes('editingPriceId')) {
  content = content.replace(
    /const \[editingPressureId, setEditingPressureId\] = useState\(null\);\s*const \[tempPressure, setTempPressure\] = useState\(''\);/,
    `const [editingPressureId, setEditingPressureId] = useState(null);
    const [tempPressure, setTempPressure] = useState('');
    
    // Quick Price Edit
    const [editingPriceId, setEditingPriceId] = useState(null);
    const [editingPriceType, setEditingPriceType] = useState(null);
    const [tempPrice, setTempPrice] = useState('');`
  );
}

// Add handler
if (!content.includes('handleSaveQuickPrice')) {
  content = content.replace(
    /const handleSaveQuickPressure = \(e, stId\) => \{[\s\S]*?setEditingPressureId\(null\);\s*\}\s*\};/,
    `const handleSaveQuickPressure = (e, stId) => {
      e.stopPropagation();
      if (editingPressureId === stId) {
        const p = parseInt(tempPressure);
        setMyStations(myStations.map(s => 
          s.id === stId ? { ...s, gasPressure: p || null } : s
        ));
        setEditingPressureId(null);
      }
    };

    const handleSaveQuickPrice = (e, stId) => {
      e.stopPropagation();
      if (editingPriceId === stId && editingPriceType) {
        const p = parseInt(tempPrice);
        setMyStations(myStations.map(s => {
          if (s.id === stId) {
            const updatedPrices = { ...(s.prices || {}) };
            if (!isNaN(p) && p > 0) updatedPrices[editingPriceType] = p;
            else delete updatedPrices[editingPriceType];
            return { ...s, prices: updatedPrices };
          }
          return s;
        }));
        setEditingPriceId(null);
        setEditingPriceType(null);
      }
    };`
  );
}

// Add JSX
const splitToken = `                              )}
                            </div>
                          )}`;

const parts = content.split(splitToken);
if (parts.length > 1 && !content.includes('className="my-st-quick-price"')) {
  // It splits at the end of the quick pressure block. We want to insert the price block right after the pressure block, which is right after the FIRST split token!
  // Wait, there might be multiple occurrences? Actually only one my-st-quick-pressure.
  const jsxToInsert = `

                          {/* Quick Edit Price */}
                          {st.type && (st.type.includes('metan') || st.type.includes('propan')) && (
                            <div className="my-st-quick-price" style={{marginTop: '10px'}} onClick={e => e.stopPropagation()}>
                              {['metan', 'propan'].filter(t => st.type.includes(t)).map(fuelType => (
                                <div key={fuelType} style={{marginBottom: '10px'}}>
                                  {editingPriceId === st.id && editingPriceType === fuelType ? (
                                    <div className="flex items-center gap-2 mt-1" style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                      <input 
                                        type="number" 
                                        value={tempPrice} 
                                        onChange={e => setTempPrice(e.target.value)} 
                                        autoFocus
                                        className="search-full-input"
                                        style={{ width: '90px', padding: '4px 8px', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', outline: 'none' }}
                                        placeholder="Narx"
                                      />
                                      <button className="status-toggle-btn active-open" style={{padding:'4px 8px', minHeight:'32px', border: 'none', background: '#3b82f6', color: 'white', borderRadius: '8px', cursor: 'pointer'}} onClick={(e) => handleSaveQuickPrice(e, st.id)}>Saqlash</button>
                                      <button className="status-toggle-btn" style={{padding:'4px 8px', minHeight:'32px', border: '1px solid #cbd5e1', background: 'transparent', borderRadius: '8px', cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); setEditingPriceId(null); setEditingPriceType(null); }}>Bekor</button>
                                    </div>
                                  ) : (
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: fuelType === 'metan' ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', padding: '8px 10px', borderRadius: '14px', border: fuelType === 'metan' ? '1px solid #bae6fd' : '1px solid #e9d5ff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ background: fuelType === 'metan' ? '#bae6fd' : '#e9d5ff', padding: '5px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          {fuelType === 'metan' ? <Flame size={14} color="#0284c7" /> : <Droplets size={14} color="#9333ea" />}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: fuelType === 'metan' ? '#082f49' : '#3b0764', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                          {fuelType === 'metan' ? 'Metan' : 'Propan'}: <strong style={{ color: fuelType === 'metan' ? '#0284c7' : '#9333ea', fontSize: '0.85rem', marginLeft: '2px' }}>{st.prices?.[fuelType] ? \`\${st.prices[fuelType].toLocaleString()} so'm\` : '—'}</strong>
                                        </span>
                                      </div>
                                      <button 
                                        style={{ 
                                          fontSize: '0.75rem', padding: '6px 10px',
                                          background: fuelType === 'metan' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'linear-gradient(135deg, #a855f7, #9333ea)',
                                          color: 'white', fontWeight: 'bold', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                          display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', flexShrink: 0
                                        }}
                                        onClick={(e) => { 
                                          e.stopPropagation(); 
                                          setEditingPriceId(st.id); 
                                          setEditingPriceType(fuelType);
                                          setTempPrice(st.prices?.[fuelType] || ''); 
                                        }}
                                      >
                                        <Edit3 size={12} /> O'zgartirish
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}`;

  content = parts[0] + splitToken + jsxToInsert + parts.slice(1).join(splitToken);
}

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Successfully injected price editor to App.jsx!");
