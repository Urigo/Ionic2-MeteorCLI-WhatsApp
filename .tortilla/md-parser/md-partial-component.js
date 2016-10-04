var MDParser = require('.');

/*
  Represents a partial component in a markdown file.
 */

MDParser.registerComponent('partial', {
  // {{>partial}}
  toTemplate: {
    value: function () {
      return '{{>' + this.name + '}}';
    }
  }
});