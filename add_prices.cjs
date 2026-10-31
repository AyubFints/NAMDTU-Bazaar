const fs = require('fs');

const jsxPath = 'C:/Users/user/Desktop/MyUp/src/components/StationCard.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

// If not imported, we need to import Flame, Droplets, Fuel, Zap
if (!jsxContent.includes('import { Flame, Droplets, Fuel, Zap }')) {
  // It probably imports some of them already. Let's just blindly add missing ones if needed.
  // Actually, wait, StationCard has: import { Navigation, Clock, MapPin, Heart, Star, Zap } from 'lucide-react';
  jsxContent = jsxContent.replace(
    /import \{\s*(.*?)\s*\} from 'lucide-react';/,
    `import { $1, Flame, Droplets, Fuel } from 'lucide-react';`
  );
}

const pricesJsx = `      </div>

      {/* Prices Row */}
      {station.category === 'fuel' && station.prices && (
        <div className="hsc-neu-prices-row">
          {station.prices.metan && (
            <div className="hsc-neu-price-pill gaz">
              <Flame size={14} color="#0ea5e9" />
              <span>{station.prices.metan.toLocaleString()} so'm</span>
            </div>
          )}
          {station.prices.propan && (
            <div className="hsc-neu-price-pill propan">
              <Droplets size={14} color="#a855f7" />
              <span>{station.prices.propan.toLocaleString()} so'm</span>
            </div>
          )}
          {(station.prices.benzin || station.prices.ai92 || station.prices.ai80) && (
            <div className="hsc-neu-price-pill benzin">
              <Fuel size={14} color="#f59e0b" />
              <span>{(station.prices.benzin || station.prices.ai92 || station.prices.ai80).toLocaleString()} so'm</span>
            </div>
          )}
          {station.prices.elektr && (
            <div className="hsc-neu-price-pill elektr">
              <Zap size={14} color="#10b981" />
              <span>{station.prices.elektr.toLocaleString()} so'm</span>
            </div>
          )}
        </div>
      )}

      <button className="hsc-neu-action-btn"`;

jsxContent = jsxContent.replace(/      <\/div>\s*<button className="hsc-neu-action-btn"/, pricesJsx);
fs.writeFileSync(jsxPath, jsxContent, 'utf8');

const cssPath = 'C:/Users/user/Desktop/MyUp/src/App.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('.hsc-neu-prices-row')) {
  cssContent += `
.hsc-neu-prices-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.hsc-neu-price-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f3f6;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #334155;
  box-shadow: 4px 4px 8px #d1d5db, -4px -4px 8px #ffffff;
}
.hsc-neu-price-pill.gaz { color: #0ea5e9; }
.hsc-neu-price-pill.propan { color: #a855f7; }
.hsc-neu-price-pill.benzin { color: #f59e0b; }
.hsc-neu-price-pill.elektr { color: #10b981; }
`;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
}
console.log("Added prices to StationCard!");
