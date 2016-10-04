var MDChunksCollection = require('./md-chunks-collection');
var MDComponent = require('./md-component');
var MDChunk = require('./md-chunk');

/*
  Markdown parser will parse a given markdown into a collection of chunks.
 */

 var Components = {};


// Returns a chunks collection of the provided markdown string
function parseMD(md, recursive) {
  var chunks = new MDChunksCollection();
  if (!md) return chunks;

  var offset = 0;
  var component = parseMDComponent(md, recursive);

  // If component not found it means we finished a recursive operation
  if (!component) {
    var text = new MDChunk(md);
    chunks.push(text);
    return chunks;
  }

  if (component._start != 0) {
    var text = new MDChunk(md.slice(0, component._start - 1));
    chunks.push(text);
  }

  // As long as there is a component join them with a text component whos type and name are non
  while (component) {
    // Check the component is the first component in the recent markdown
    if (offset) {
      // If so, update the indices with the stored offset
      component._start += offset;
      component._end += offset;

      // Generate a text component with the leftover
      if (offset != component._start) {
        var text = new MDChunk(md.slice(offset, component._start - 1));
        chunks.push(text);
      }
    }

    chunks.push(component);

    // Add line skip
    offset = component._end + 1;
    // Generate next components from the current component's end index
    component = parseMDComponent(md.substr(offset), recursive);
  }

  // Checks if there are leftovers and if so put it in a text component
  if (offset <= md.length) {
    var text = new MDChunk(md.slice(offset, md.length));
    chunks.push(text);
  }

  return chunks;
}

function parseMDComponent(md, recursive) {
  var match = md.match(/\[\{\]: <([^>]*)> \([^\)]*\)/);
  if (!match) return;

  var type = match[1];
  var Component = Components[type] || MDComponent;
  return new Component(md, recursive);
}

// Let's you define a custom component type which will be used in the parsing process
function registerComponent(type, descriptors) {
  // Create inheriting class dynamically
  var Component = function () {
    return MDComponent.apply(this, arguments);
  }

  Component.prototype = Object.create(MDComponent.prototype, descriptors);

  // If everything went well, stash it
  Components[type] = Component;
  // Chainable
  return module.exports;
}


module.exports = {
  parse: parseMD,
  registerComponent: registerComponent
};

// Built-in component types
require('./md-helper-component');
require('./md-partial-component');