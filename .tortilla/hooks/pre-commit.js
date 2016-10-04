var Git = require('../git');
var Step = require('../step');

/*
  Pre-commit git hook launches right before we commit changes. If an error was thrown
  the commit process will be aborted with the provided error message.
 */

(function () {
  if (process.env.TORTILLA_CHILD_PROCESS) return;

  // Prohibit regular commits
  if (!Git.gonnaAmend()) throw Error(
    'New commits are prohibited! Use `$ npm step -- push` instead'
  );

  if (!Git.rebasing()) throw Error([
    'Changes are not allowed outside editing mode!',
    'Use `$ npm step -- edit` and then make your changes'
  ].join(' '));

  var stepMessage = Step.recentCommit('%s');
  var stepDescriptor = Step.descriptor(stepMessage);
  var isSuperStep = stepDescriptor && !stepDescriptor.number.split('.')[1];

  // If this is a super step only the appropriate manual file can be modified
  if (isSuperStep) {
    var tag = 'step' + stepDescriptor.number;
    var manualFile = tag + '.md';
    var errorMessage = '\'' + manualFile + '\' is the only file that can be modified';

    // Files that don't start with 'steps/'
    var stagedFiles = Git.stagedFiles(/^(?!steps\/)/);
    if (stagedFiles.length) throw Error(errorMessage);

    // '.md' files that start with 'steps/' e.g. steps/step1.md
    var pattern = new RegExp('^steps/(?!' + tag + '\\.md)');
    stagedFiles = Git.stagedFiles(pattern);
    if (stagedFiles.length) throw Error(errorMessage);
  }
  // Else manual files can't be modifed
  else {
    var stagedFiles = Git.stagedFiles(/^steps\//);

    if (stagedFiles.length) throw Error(
      'Step manual files can\'t be modified'
    );

    // It means we're editing root
    if (!stepDescriptor) return;

    stagedFiles = Git.stagedFiles(/^README.md/);

    if (stagedFiles.length) throw Error(
      'README.md can\'t be modified'
    );
  }
})();