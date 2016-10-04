var Path = require('path');
var Paths = require('./paths');
var Utils = require('./utils');

/*
  Contains general git utilities.
 */

var git = Utils.git;

// Tells if rebasing or not
function isRebasing() {
  return Utils.exists(Paths.git.rebaseMerge) || Utils.exists(Paths.git.rebaseApply);
}

// Tells if cherry-picking or not
function isCherryPicking() {
  return Utils.exists(Paths.git.heads.cherryPick) || Utils.exists(Paths.git.heads.revert);
}

// Tells if going to amend or not
function gonnaAmend() {
  return Utils.runBy('git', ['commit', '--amend']);
}

// Tells if a tag exists or not
function tagExists(tag) {
  return Utils.exists(Path.resolve(Paths.git.refs.tags, tag));
}

// Get the recent commit by the provided arguments. An offset can be specified which
// means that the recent commit from several times back can be fetched as well
function getRecentCommit(offset, argv) {
  if (offset instanceof Array) {
    argv = offset;
    offset = 0;
  }
  else {
    argv = argv || [];
    offset = offset || 0;
  }

  var hash = typeof offset == 'string' ? offset : ('HEAD~' + offset);

  argv = ['log', hash, '-1'].concat(argv);
  return git(argv);
}

// Gets a list of the modified files reported by git matching the provided pattern.
// This includes untracked files, changed files and deleted files
function getStagedFiles(pattern) {
  var stagedFiles = git(['diff', '--name-only', '--cached'])
    .split('\n')
    .filter(Boolean);

  return Utils.filterMatches(stagedFiles, pattern);
}


module.exports = Utils.extend(git.bind(null), git, {
  rebasing: isRebasing,
  cherryPicking: isCherryPicking,
  gonnaAmend: gonnaAmend,
  tagExists: tagExists,
  recentCommit: getRecentCommit,
  stagedFiles: getStagedFiles
});