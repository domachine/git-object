
/**
 * Module dependencies.
 */

var cp = require('child_process')
  , spawn = cp.spawn;

/**
 * Module exports.
 */

module.exports = GitObject;

/**
 * Base class for tree and blob.
 */

function GitObject(repo, hash) {
  this.repo = repo;
  this.hash = hash;
}

/**
 * `git show`s the object.
 */

GitObject.prototype.show = function(){
  var git = spawn('git', ['show', this.hash], {
    cwd: this.repo
  });
  return git.stdout;
};

/**
 * Used to check if this is a blob.  Faster than `typeof` reflection.
 */

GitObject.prototype.isBlob = function(){
  return false;
};

/**
 * Used to check if this is a blob.  Faster than `typeof` reflection.
 */

GitObject.prototype.isTree = function(){
  return false;
};
