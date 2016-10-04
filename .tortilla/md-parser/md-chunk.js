/*
  Represents a single chunk in a markdown being parsed.
 */

function MDChunk(md) {
  this.content = md;
}

MDChunk.prototype = Object.create(Object.prototype, {
  // This method should return a template that is renderable using md-renderer
  toTemplate: {
    value: function () {
      return this.content;
    }
  },
  toString: {
    value: function () {
      return this.content;
    }
  },
  valueOf: {
    value: function () {
      return this.content;
    }
  }
});


module.exports = MDChunk;