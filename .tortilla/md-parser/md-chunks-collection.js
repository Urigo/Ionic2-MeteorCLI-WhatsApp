/*
  A collection of markdown chunks that should be returned by the md-parser.
 */

function MDChunksCollection() {
  Array.apply(this, arguments);
}

// There shouldn't be any major issues when inheriting from an array on NodeJS platform
MDChunksCollection.prototype = Object.create(Array.prototype, {
  // Convert chunks to template string which can be handled by md-renderer
  toTemplate: {
    value: function() {
      return this.map(function (chunk) {
        return chunk.toTemplate();
      }).join('\n');
    }
  },
  // Join all md-chunk strings
  toString: {
    configurable: true,
    writable: true,
    value: function () {
      return this.map(function (chunk) {
        return chunk.toString();
      }).join('\n');
    }
  },
  // Join all md-chunk values
  valueOf: {
    configurable: true,
    writable: true,
    value: function () {
      return this.map(function (chunk) {
        return chunk.valueOf();
      }).join('\n');
    }
  }
});


module.exports = MDChunksCollection;