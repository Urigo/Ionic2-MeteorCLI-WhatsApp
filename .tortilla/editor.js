var Fs = require('fs');
var Path = require('path');
var Minimist = require('minimist');
var Paths = require('./paths');
var Step = require('./step');

/*
  This is the editor for interactive rebases and ammended commits. Instead of openning
  an editing software like nano or vim, this module will edit the file by specified
  methods we choose.
 */

function main() {
  var argv = Minimist(process.argv.slice(2), {
    string: ['_', 'message', 'm']
  });

  // The first argument will be the rebase file path provided to us by git
  var method = argv._[0];
  var rebaseFilePath = argv._[1];
  var message = argv.message || argv.m;

  var rebaseFileContent = Fs.readFileSync(rebaseFilePath, 'utf8');
  // Convert to array of jsons so it would be more comfortable to word with
  var operations = disassemblyOperations(rebaseFileContent);

  // Automatically invoke a method by the provided arguments.
  // The methods will manipulate the operations array.
  switch (method) {
    case 'edit': editStep(operations); break;
    case 'reword': rewordStep(operations, message); break;
    case 'convert': convertManuals(operations); break;
  }

  // Reset all tags
  operations.push({
    method: 'exec',
    command: 'node ' + Paths.tortilla.retagger
  });

  // Put everything back together and rewrite the rebase file
  var newRebaseFileContent = assemblyOperations(operations);
  Fs.writeFileSync(rebaseFilePath, newRebaseFileContent);
}

// Edit the last step in the rebase file
function editStep(operations) {
  operations[0].method = 'edit';

  var offset = 1;

  // Creating a clone of the operations array otherwise splices couldn't be applied
  // without aborting the itration. In addition we hold an offset variable to handle
  // the changes that are made in the array's length
  operations.slice(offset).forEach(function (operation, index) {
    var isSuperStep = !!Step.superDescriptor(operation.message);

    // If this is a super step, replace pick operation with the super pick
    if (isSuperStep) operations.splice(index + offset, 1, {
      method: 'exec',
      command: 'node ' + Paths.tortilla.superPicker + ' ' + operation.hash
    });

    // Update commit's step number
    operations.splice(index + ++offset, 0, {
      method: 'exec',
      command: 'GIT_EDITOR=true node ' + Paths.tortilla.reworder
    });
  });
}

// Reword the last step in the rebase file
function rewordStep(operations, message) {
  var argv = [Paths.tortilla.reworder];
  if (message) argv.push('"' + message + '"');

  // Replace original message with the provided message
  operations.splice(1, 0, {
    method: 'exec',
    command: 'node ' + argv.join(' ')
  });
}

// Convert all manuals since the beginning of history to the opposite format
function convertManuals(operations) {
  var path = Paths.readme;
  var offset = 2;

  // Convert README.md
  operations.splice(1, 0, {
    method: 'exec',
    command: 'node ' + Paths.tortilla.manual + ' convert --root'
  });

  operations.slice(offset).forEach(function (operation, index) {
    var stepDescriptor = Step.superDescriptor(operation.message);
    if (!stepDescriptor) return;

    var file = 'step' + stepDescriptor.number + '.md';
    var path = Path.resolve(Paths.steps, file);

    // Convert step manual file
    operations.splice(index + ++offset, 0, {
      method: 'exec',
      command: 'node ' + Paths.tortilla.manual + ' convert ' + stepDescriptor.number
    });

    return offset;
  });
}

// Convert rebase file content to operations array
function disassemblyOperations(rebaseFileContent) {
  var operations = rebaseFileContent.match(/^[a-z]+\s.{7}.*$/mg);
  if (!operations) return;

  return operations.map(function (line) {
    var split = line.split(' ');

    return {
      method: split[0],
      hash: split[1],
      message: split.slice(2).join(' ')
    };
  });
}

// Convert operations array to rebase file content
function assemblyOperations(operations) {
  return operations
    .map(function (operation) {
      return Object.keys(operation)
        .map(function (k) { return operation[k] })
        .join(' ');
    })
    .join('\n') + '\n';
}


if (require.main === module) main();
