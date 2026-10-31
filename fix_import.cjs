const fs = require('fs');
const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// Replace duplicate User
content = content.replace(/import \{ Fuel, Flame, Droplets, Zap, User, ChevronRight, Plus, Edit3, MapPin, Star, Clock, Phone, Settings, Home, Search, Map, User \} from 'lucide-react';/,
"import { Fuel, Flame, Droplets, Zap, User, ChevronRight, Plus, Edit3, MapPin, Star, Clock, Phone, Settings, Home, Search, Map } from 'lucide-react';");

fs.writeFileSync(appPath, content, 'utf8');
console.log("Fixed duplicate User import!");
