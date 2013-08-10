
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
var GitBlob = exports.Blob = require('./blob');
var GitTree = exports.Tree = require('./tree');

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
