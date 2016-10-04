var ChildProcess = require('child_process');
var Fs = require('fs');
var Paths = require('./paths');

/*
  Contains general utilities.
 */

var git = exec.bind(null, 'git');
var gitPrint = execPrint.bind(null, 'git');
var node = exec.bind(null, 'node');
var nodePrint = execPrint.bind(null, 'node');
var npm = exec.bind(null, 'npm');
var npmPrint = execPrint.bind(null, 'npm');

node.print = nodePrint;
npm.print = npmPrint;
git.print = gitPrint;
exec.print = execPrint;


// Checks if one of the parent processes launched by the provided file and has
// the provided arguments
function isRunBy(file, argv, offset) {
  // There might be nested processes of the same file so we wanna go through all of them,
  // This variable represents how much skips will be done anytime the file is found.
  var trial = offset = offset || 0;

  // The current process would be the node's
  var currProcess = {
    file: process.title,
    pid: process.pid,
    argv: process.argv
  };

  // Will abort once the file is found and there are no more skips left to be done
  while (currProcess.file != file || trial--) {
    // Get the parent process id
    currProcess.pid = Number(getProcessData(currProcess.pid, 'ppid'));
    // The root process'es id is 0 which means we've reached the limit
    if (!currProcess.pid) return false;

    currProcess.argv = getProcessData(currProcess.pid, 'command')
      .split(' ')
      .filter(Boolean);

    // The first word in the command would be the file name
    currProcess.file = currProcess.argv[0];
    // The rest would be the arguments vector
    currProcess.argv = currProcess.argv.slice(1);
  }

  // Make sure it has the provided arguments
  var result = argv.every(function (arg) {
    return currProcess.argv.indexOf(arg) != -1;
  });

  // If this is not the file we're looking for keep going up in the processes tree
  return result || isRunBy(file, argv, ++offset);
}

// Gets process data using 'ps' formatting
function getProcessData(pid, format) {
  if (arguments.length == 1) {
    format = pid;
    pid = process.pid;
  }

  return exec('ps', ['--no-headers', '-p', pid, '-o', format]);
}

// Spawn new process and print result to the terminal
function execPrint(file, argv, env, input) {
  if (!(argv instanceof Array)) {
    input = env;
    env = argv;
    argv = [];
  }

  if (!(env instanceof Object)) {
    input = env;
    env = {};
  }

  env = extend({
    TORTILLA_CHILD_PROCESS: true
  }, process.env, env);

  return ChildProcess.spawnSync(file, argv, {
    cwd: Paths._,
    env: env,
    input: input,
    stdio: env.TORTILLA_STDIO || 'inherit'
  });
}

// Execute file
function exec(file, argv, env, input) {
  if (!(argv instanceof Array)) {
    input = env;
    env = argv;
    argv = [];
  }

  if (!(env instanceof Object)) {
    input = env;
    env = {};
  }

  env = extend({
    TORTILLA_CHILD_PROCESS: true
  }, process.env, env);

  return ChildProcess.execFileSync(file, argv, {
    cwd: Paths._,
    env: env,
    input: input,
    stdio: 'pipe'
  }).toString()
    .trim();
}

// Tells if entity exists or not by an optional document type
function exists(path, type) {
  try {
    var stats = Fs.lstatSync(path);

    switch (type) {
      case 'dir': return stats.isDirectory();
      case 'file': return stats.isFile();
      default: return true;
    }
  }
  catch (err) {
    return false;
  }
}

// Filter all strings matching the provided pattern in an array
function filterMatches(arr, pattern) {
  pattern = pattern || '';

  return arr.filter(function (str) {
    return str.match(pattern);
  });
}

// Extend destination object with provided sources
function extend(destination) {
  var sources = [].slice.call(arguments, 1);

  sources.forEach(function (source) {
    Object.keys(source).forEach(function (k) {
      destination[k] = source[k];
    });
  });

  return destination;
}

// Pad the provided string with the provided pad params from the left
// '1' -> '00001'
function pad(str, length, char) {
  str = str.toString();
  char = char || ' ';
  var chars = Array(length + 1).join(char);

  return chars.substr(0, chars.length - str.length) + str;
}


module.exports = {
  runBy: isRunBy,
  processData: getProcessData,
  npm: npm,
  node: node,
  git: git,
  exec: exec,
  exists: exists,
  filterMatches: filterMatches,
  extend: extend,
  pad: pad
};