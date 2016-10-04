var Git = require('./git');
var Step = require('./step');

/*
  The retagger is responsible for resetting all step tags.
 */

function main() {
  var stepTags = Git(['tag', '-l', 'step*'])
    .split('\n')
    .filter(Boolean);

  // Delete all tags to prevent conflicts
  Git(['tag', '-d', 'root']);

  stepTags.forEach(function (stepTag) {
    Git(['tag', '-d', stepTag]);
  });

  // If any steps exist take the hash before the inital step, else take the recent hash
  var stepsExist = Git.recentCommit(['--grep=^Step 1.1']);
  var rootHash = stepsExist ? Step.base('1.1') : Git.recentCommit(['--format=%h']);

  var stepCommits = Git(['log',
    '--grep=^Step [0-9]\\+:',
    '--format={ "hash": "%h", "message": "%s" }'
  ]).split('\n')
    .filter(Boolean)
    .map(JSON.parse);

  // Reset all tags
  Git(['tag', 'root', rootHash]);

  stepCommits.forEach(function (commit) {
    var hash = commit.hash;
    var message = commit.message;
    var descriptor = Step.descriptor(commit.message);
    var tag = 'step' + descriptor.number;

    Git(['tag', tag, hash]);
  });
}

if (require.main === module) main();