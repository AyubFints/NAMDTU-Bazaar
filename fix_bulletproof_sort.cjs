const fs = require('fs');
const jsxPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(jsxPath, 'utf8');

// Replace the sorting block with a bulletproof version
const sortingBlockRegex = /if \(fuelSortBy === 'nearest'\) \{[\s\S]*?\} else \{\s*result\.sort\(\(a, b\) => a\.calculatedDistance - b\.calculatedDistance\);\s*\}/m;

const bulletproofSort = `if (fuelSortBy === 'nearest') {
        result.sort((a, b) => (a.calculatedDistance || 0) - (b.calculatedDistance || 0));
      } else if (fuelSortBy === 'cheapest') {
        result.sort((a, b) => {
          const pA = getPrice(a);
          const pB = getPrice(b);
          if (pA < pB) return -1;
          if (pA > pB) return 1;
          return (a.calculatedDistance || 0) - (b.calculatedDistance || 0);
        });
      } else if (fuelSortBy === 'nearest_cheap') {
        result.sort((a, b) => {
          const aNear = (a.calculatedDistance || 0) <= 20;
          const bNear = (b.calculatedDistance || 0) <= 20;
          if (aNear && !bNear) return -1;
          if (!aNear && bNear) return 1;
          const pA = getPrice(a);
          const pB = getPrice(b);
          if (pA < pB) return -1;
          if (pA > pB) return 1;
          return (a.calculatedDistance || 0) - (b.calculatedDistance || 0);
        });
      } else if (fuelSortBy === 'nearest_best') {
        result.sort((a, b) => {
          const aNear = (a.calculatedDistance || 0) <= 28;
          const bNear = (b.calculatedDistance || 0) <= 28;
          if (aNear && !bNear) return -1;
          if (!aNear && bNear) return 1;
          const rA = a.rating || 0;
          const rB = b.rating || 0;
          if (rA !== rB) return rB - rA;
          return (a.calculatedDistance || 0) - (b.calculatedDistance || 0);
        });
      }
    } else {
      result.sort((a, b) => (a.calculatedDistance || 0) - (b.calculatedDistance || 0));
    }`;

content = content.replace(sortingBlockRegex, bulletproofSort);
fs.writeFileSync(jsxPath, content, 'utf8');
console.log("Bulletproof sorting applied!");
