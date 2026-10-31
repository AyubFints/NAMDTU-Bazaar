const fs = require('fs');
const appPath = 'C:/Users/user/Desktop/MyUp/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// The exact string we need to replace
const targetStr = `                  </div>
                </div>
              
            </div>
          </>
        )}`;

const replacementStr = `                  </div>
                </div>
              </div>
            </div>
          </>
        )}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(appPath, content, 'utf8');
  console.log("Fixed missing closing div!");
} else {
  console.log("Could not find the target string.");
}
