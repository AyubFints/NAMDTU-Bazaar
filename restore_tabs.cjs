const fs = require('fs');

const orig = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx.bak', 'utf8');
const curr = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx', 'utf8');

// EXTRACT NEW HOME STUFF FROM CURRENT
// In curr, we want `<header className="top-header">` up to the end of `app-content`
const headerIdx = curr.indexOf('<header className="top-header">');
const appContentEnd = curr.indexOf('</div>', curr.lastIndexOf('<div className="right-panel-map"'));
// wait, right-panel-map is inside app-content.
// let's just find `</div>` after MapView
const mapIdx = curr.indexOf('<MapView />');
const rightPanelEnd = curr.indexOf('</div>', mapIdx);
const appContentClose = curr.indexOf('</div>', rightPanelEnd + 1);

let newHomeContent = curr.substring(headerIdx, appContentClose + 6);

// Remove "Xizmatlar" from new header
newHomeContent = newHomeContent.replace(/<button className=\{`desktop-nav-item \$\{activeTab === 'services' \? 'active' : ''\}`} onClick=\{\(\) => handleTabChange\('services'\)\}>[\s\S]*?<\/button>/, '');


// EXTRACT OLD STUFF FROM ORIG
const mainStart = orig.indexOf('<main className="content-area pb-20">');
const mainEnd = orig.indexOf('</main>') + 7;
let oldMainContent = orig.substring(mainStart, mainEnd);

// Remove the home tab from old main content
// It looks like: {activeTab === 'home' && ( ... )}
const oldHomeStart = oldMainContent.indexOf("{activeTab === 'home' && (");
// it ends right before {activeTab === 'search' && (
const oldSearchStart = oldMainContent.indexOf("{activeTab === 'search' && (");
oldMainContent = oldMainContent.substring(0, oldHomeStart) + oldMainContent.substring(oldSearchStart);


// COMBINE
const beforeMainReturn = orig.substring(0, orig.indexOf('return (', orig.indexOf('handleSplashComplete'))); // wait, just find the main return
const returnRegex = /return \(\s*<div className="app-container">/;
const returnMatch = orig.match(returnRegex);

const head = orig.substring(0, returnMatch.index);
const tail = orig.substring(mainEnd, orig.length);

const finalCode = `${head}
  return (
    <div className="app-container" style={{ background: activeTab === 'home' ? 'var(--dark-bg)' : 'var(--bg-color)', color: activeTab === 'home' ? 'var(--dark-text-main)' : 'var(--text-primary)' }}>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {activeTab === 'home' && (
        <>
          ${newHomeContent}
        </>
      )}

      {activeTab !== 'home' && (
        <>
          ${oldMainContent}
        </>
      )}
${tail.substring(tail.indexOf('      {/* Profile Detail Modal */}'))}
`;

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.jsx', finalCode, 'utf8');
console.log('Done!');
