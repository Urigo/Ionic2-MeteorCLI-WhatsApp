var Fs = require('fs');
var Git = require('../git');
var LocalStorage = require('../local-storage');
var Paths = require('../paths');
var Step = require('../step');

/*
  Commit-message git hook launches right after we wrote our commit message.
  If an error was thrown the commit process will be aborted with the provided error
  message.
 */

(function () {
  // Amend is the only thing allowed by tortilla, the rest is irrelevant
  if (!process.env.TORTILLA_CHILD_PROCESS && !Git.gonnaAmend()) return;

  // If we're amending to the root commit then a step prefix is not needed
  if (Git.gonnaAmend() && !LocalStorage.getItem('STEP')) return;

  var commitMessage = Fs.readFileSync(Paths.git.messages.commit, 'utf8');
  // Prepend a step prefix to the commit message
  var step = LocalStorage.getItem('STEP') || Step.next(1);
  var fixedcommitMessage = 'Step ' + step + ': ' + commitMessage
  // Clearing storage to prevent conflicts with upcomming commits
  LocalStorage.removeItem('STEP');

  // Rewrite the commit with a step prefix
  Fs.writeFileSync(Paths.git.messages.commit, fixedcommitMessage);
})();