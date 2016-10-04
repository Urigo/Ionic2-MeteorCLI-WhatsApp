var NodeLocalStorage = require('node-localstorage');
var Paths = require('./paths');

/*
  A local-storage whos storage dir is git's internals dir. Comes in handy when we want
  to share data between processes like git-hooks.
 */

var LocalStorage = NodeLocalStorage.LocalStorage;
var localStorage = new LocalStorage(Paths.git._);


module.exports = localStorage;