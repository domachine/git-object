
/**
 * Module dependencies.
 */

var cp = require('child_process')
  , util = require('util')
  , spawn = cp.spawn

  // symbol imports

  , inherits = util.inherits;

/**
 * Module exports.
 */

exports = module.exports = fromPath;
exports.Blob = GitBlob;
exports.Tree = GitTree;

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
 * Subclass for handling blobs.
 */

function GitBlob(repo, hash, name) {
  GitObject.call(this, repo, hash);
  this.name = name;
}
inherits(GitBlob, GitObject);

/**
 * Create a read stream to the blob.
 */

GitBlob.prototype.createReadStream = function(){
  return this.show();
};

/**
 * Subclass for handling trees.
 */

function GitTree(repo, hash, name) {
  GitObject.call(this, repo, hash);
  this.name = name;
}
inherits(GitTree, GitObject);

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

/**
 * Create an object from a path.
 *
 * @param {String} repo the repository path read from
 * @param {String} branch the branch to read from
 * @param {String} path the file path
 * @param {Function} fn function(error, gitObject)
 */

function fromPath(repo, branch, path, fn){
  var git
    , data = '';
  git = spawn('git', ['ls-tree', branch, path], {
    cwd: repo
  });

  // collect git's output

  git.stdout.on('data', function(d){
    data += d;
  });
  git.stdout.once('close', function(){
    data = data.split(/[ \t\n]/);
    if (data.length <= 1) {

      // blob not found

      return (function(){
        var err = new Error('blob not found');
        err.statusCode = 404;
        fn(err);
      })();
    }
    if (data[1] == 'blob') {
      fn(null, new GitBlob(repo, data[2], data[3]));
    } else {
      fn(null, new GitTree(repo, data[2], data[3]));
    }
  });
};
