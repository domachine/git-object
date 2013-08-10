
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

module.exports = GitBlob;

/**
 * Subclass for handling blobs.
 */

function GitBlob(repo, hash, name) {
  GitObject.call(this, repo, hash);
  this.name = name;
}
inherits(GitBlob, GitObject);

/**
 * Override indicator.
 */

GitBlob.prototype.isBlob = function(){
  return true;
};

/**
 * Create a read stream to the blob.
 */

GitBlob.prototype.createReadStream = function(){
  return this.show();
};
