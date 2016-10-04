var Fs = require('fs');
var Manual = require('../manual');
var Utils = require('../utils');

/*
  Pre-push git hook launches right before we push our changes. If an error was thrown
  the pushing process will be aborted with the provided error message.
 */

(function () {
  // Get all manual files paths
  var manualPaths = [];
  var manualPath = Manual.path('root');
  var step = 0;

  do {
    manualPaths.push(manualPath);
    manualPath = Manual.path(++step);
  } while (Utils.exists(manualPath));

  manualPaths.forEach(function (manualPath, index) {
    var manual = Fs.readFileSync(manualPath, 'utf8');
    // If in production mode, move on to the next one
    if (Manual.isProd(manual)) return;

    var stepOption = index || '--root';

    // If in development, throw an error which will abort the pushing process
    throw Error([
      '\'' + manualPath + '\' must be in production mode before pushing changes!',
      'To fix this, run `$ npm run manual -- convert ' + stepOption + '` and then',
      'try to push again.'
    ].join(' '));
  });
})();