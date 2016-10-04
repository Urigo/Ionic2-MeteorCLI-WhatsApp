var MDParser = require('.');

/*
  Represents a helper component in a markdown file.
 */

MDParser.registerComponent('helper', {
  // {{{helper ...params}}}
  toTemplate: {
    value: function () {
      // Full params string including name
      var params = [this.name].concat(this.params).join(' ');
      return '{{{' + params + '}}}';
    }
  }
});