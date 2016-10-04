var Fs = require('fs');
var Path = require('path');
var Paths = require('../paths');
var MDComponent = require('../md-parser/md-component');

/*
  A very simple renderer which shares the same syntax as handlebar's when it comes to
  models, partials and helpers. Templates which are rendered using md-renderer will be
  parsable by md-parser.
 */

var helpers = {};
var partials = {};


// Read the provided file, render it, and overwrite it. Use with caution!
function overwriteTemplateFile(templatePath, scope) {
  templatePath = Path.resolve(Paths.tortilla.templates, templatePath);
  var view = renderTemplateFile(templatePath, scope);

  return Fs.writeFileSync(templatePath, view);
}

// Read provided file and render its template. Note that the default path would
// be tortilla's template dir, so specifying a file name would be ok as well
function renderTemplateFile(templatePath, scope) {
  templatePath = Path.resolve(Paths.tortilla.templates, templatePath);
  var template = Fs.readFileSync(templatePath, 'utf8');

  return renderTemplate(template, scope);
}

// Render provided tempalte
function renderTemplate(template, scope) {
  scope = scope || {};

  // Replace notations with values. ORDER IS CRITIC!
  return template
    // Models
    .replace(/\{\{([^\}]+)\}\}/g, function (match, modelName) {
      var isModel = ['{', '>'].indexOf(modelName[0]) == -1;
      return isModel ? scope[modelName] : match;
    })
    // Helpers
    .replace(/\{\{\{([^\}]+)\}\}\}/g, function (match, params) {
      params = params.split(' ');
      var helperName = params.shift();
      return helpers[helperName].apply(scope, params);
    })
    // Partials
    .replace(/\{\{>([^\}]+)\}\}/g, function (match, partialName) {
      return renderTemplate(partials[partialName], scope);
    });
}

// Register a new helper. Registered helpers will be wrapped with a
// [{]: <helper> (name ...params) [}]: #
function registerHelper(name, helper) {
  helpers[name] = function() {
    var out = helper.apply(this, arguments);

    if (typeof out != 'string') throw Error([
      'Template helper', name, 'must return a string!',
      'Instead it returned', out
    ].join(' '));

    var params = [].slice.call(arguments);
    return MDComponent.wrap('helper', name, params, out);
  }

  // Chainable
  return module.exports;
}

// Register a new partial. Registered partials will be wrapped with a
// [{]: <partial> (name) [}]: #
function registerPartial(name, partial) {
  partials[name] = MDComponent.wrap('partial', name, partial);
  // Chainable
  return module.exports;
}


module.exports = {
  overwriteTemplateFile: overwriteTemplateFile,
  renderTemplateFile: renderTemplateFile,
  renderTemplate: renderTemplate,
  registerHelper: registerHelper,
  registerPartial: registerPartial
};

// Built-in helpers and partials
require('./diff-step-helper');
require('./nav-step-helper');
