var Minimist = require('minimist')
var Git = require('./git');
var LocalStorage = require('./local-storage');
var Step = require('./step');

/*
  Responsible for editing the recent commit's message. It will also adjust the step's
  number if needed.
 */

function main() {
  var argv = Minimist(process.argv.slice(2), {
    string: ['_']
  });

  var message = argv._[0];

  // Calculate next step based on the current commit's message
  var commitMessage = Git.recentCommit(['--format=%s']);
  var stepDescriptor = Step.descriptor(commitMessage);
  var nextStep = getNextStep(stepDescriptor);
  // Open the editor by default
  var argv = ['commit', '--amend', '--allow-empty'];
  // If message provided skip editor
  if (message) argv.push('-m', message);

  // Specified step is gonna be used for when forming the commit message
  LocalStorage.setItem('STEP', nextStep);
  // commit, let git hooks do the rest
  Git.print(argv);
}

// Calculate the next step dynamically based on its super flag
function getNextStep(stepDescriptor) {
  if (!stepDescriptor) return '';

  var isSubStep = !!stepDescriptor.number.split('.')[1];
  return isSubStep ? Step.next(1) : Step.nextSuper(1);
}


if (require.main === module) main();