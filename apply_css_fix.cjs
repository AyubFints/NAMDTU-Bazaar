const fs = require('fs');

const origCss = fs.readFileSync('C:/Users/user/Desktop/MyUp/src/App.css.bak', 'utf8');

const darkCss = `
.dark-theme-home {
  --bg-color: #0E0E10;
  --panel-bg: #1A1A1C;
  --card-bg: #222225;
  --text-main: #FFFFFF;
  --text-muted: #A0A0A5;
  --accent-blue: #38bdf8;
  --accent-green: #34d399;
  --accent-red: #ef4444;
  --border-color: #333336;
  
  background-color: var(--bg-color);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dark-theme-home .top-header {
  height: 60px;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.dark-theme-home .logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-main);
}

.dark-theme-home .desktop-nav {
  display: flex;
  gap: 20px;
}

.dark-theme-home .desktop-nav-item {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}
.dark-theme-home .desktop-nav-item:hover {
  color: var(--text-main);
  background-color: var(--panel-bg);
}

.dark-theme-home .app-content {
  display: flex;
  flex: 1;
  height: calc(100vh - 60px);
}

.dark-theme-home .left-panel {
  width: 380px;
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dark-theme-home .right-panel-map {
  flex: 1;
  height: 100%;
  position: relative;
}

.dark-theme-home .fuel-filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.dark-theme-home .fuel-btn {
  background-color: var(--panel-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: flex-start;
}
.dark-theme-home .fuel-btn:hover {
  background-color: var(--card-bg);
  border-color: #444;
}
.dark-theme-home .fuel-btn.active {
  background-color: var(--card-bg);
  border-color: var(--accent-blue);
}

.dark-theme-home .fuel-icon {
  color: var(--text-muted);
}
.dark-theme-home .fuel-btn.active .fuel-icon {
  color: var(--accent-blue);
}

.dark-theme-home .station-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Make sure the original main map container spans correctly */
.map-full-container {
  height: 100%;
}

@media (max-width: 1023px) {
  .dark-theme-home .desktop-nav {
    display: none;
  }
  .dark-theme-home .left-panel {
    width: 100%;
    border-right: none;
  }
  .dark-theme-home .right-panel-map {
    display: none;
  }
}

@media (min-width: 1024px) {
  .dark-theme-home .app-content {
    max-width: 1400px;
    margin: 0 auto;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    width: 100%;
  }
}
`;

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/App.css', origCss + '\n\n' + darkCss, 'utf8');
console.log('App.css scoped correctly!');
