
/**
 * Module dependencies.
 */

var GitObject = require('./object')
  , util = require('util')

  // symbol imports

  , inherits = util.inherits;

/**
 * Module exports.
 */

module.exports = GitTree;

/**
 * Subclass for handling trees.
 */

function GitTree(repo, hash, name) {
  GitObject.call(this, repo, hash);
  this.name = name;
}
inherits(GitTree, GitObject);

/**
 * Override indicator.
 */

GitTree.prototype.isTree = function(){
  return true;
};

/**
 * Get the contents.
 *
 * @return {Array} the filenames
 */

GitTree.prototype.contents = function(fn){
  var data = '';
  var stream = this.show();
  stream.on('data', function(d){
    data += d;
  });
  stream.once('close', function(){
    var contents = data.split('\n');

    // strip header

    contents.shift();
    contents.shift();
    contents.pop();
    fn(null, contents);
  });
};
