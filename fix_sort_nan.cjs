const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace cheapest sort
content = content.replace(
  /\} else if \(fuelSortBy === 'cheapest'\) \{\s*result\.sort\(\(a, b\) => \{\s*const diff = getPrice\(a\) - getPrice\(b\);\s*return diff !== 0 \? diff : a\.calculatedDistance - b\.calculatedDistance;\s*\}\);/m,
  `} else if (fuelSortBy === 'cheapest') {
        result.sort((a, b) => {
          const pA = getPrice(a);
          const pB = getPrice(b);
          if (pA < pB) return -1;
          if (pA > pB) return 1;
          return a.calculatedDistance - b.calculatedDistance;
        });`
);

// Replace nearest_cheap sort
content = content.replace(
  /\} else if \(fuelSortBy === 'nearest_cheap'\) \{\s*result\.sort\(\(a, b\) => \{\s*const aNear = a\.calculatedDistance <= 20;\s*const bNear = b\.calculatedDistance <= 20;\s*if \(aNear && !bNear\) return -1;\s*if \(!aNear && bNear\) return 1;\s*const diff = getPrice\(a\) - getPrice\(b\);\s*return diff !== 0 \? diff : a\.calculatedDistance - b\.calculatedDistance;\s*\}\);/m,
  `} else if (fuelSortBy === 'nearest_cheap') {
        result.sort((a, b) => {
          const aNear = a.calculatedDistance <= 20;
          const bNear = b.calculatedDistance <= 20;
          if (aNear && !bNear) return -1;
          if (!aNear && bNear) return 1;
          const pA = getPrice(a);
          const pB = getPrice(b);
          if (pA < pB) return -1;
          if (pA > pB) return 1;
          return a.calculatedDistance - b.calculatedDistance;
        });`
);

fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Fixed NaN bug in sorting!");
