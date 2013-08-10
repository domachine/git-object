
/**
 * Module dependencies.
 */

var fs = require('fs')
  , chai = require('chai')
  , assert = chai.assert
  , should = chai.should()
  , pipette = require('pipette')
  , fromPath = require('../lib/git-object')
  , readFile = fs.readFileSync
  , Sink = pipette.Sink;

/**
 * Tests.
 */

describe('fromPath()', function(){
  it('should create a blob', function(done){
    fromPath('.', 'master', 'index.js', function(err, object){
      if (err) return done(err);
      assert.ok(object instanceof fromPath.Blob);
      assert.ok(object.isBlob() && !object.isTree());
      var sink = new Sink(object.show());
      sink.on('data', function(d){
        d.toString().should.equal([
          '',
          "module.exports = require('./lib/git-object');"
        ].join('\n'));
        done();
      });
    });
  });
  it('should create a tree', function(done){
    fromPath('.', 'master', 'lib', function(err, object){
      if (err) return done(err);
      assert.ok(object instanceof fromPath.Tree);
      assert.ok(object.isTree() && !object.isBlob());
      object.contents(function(err, contents){
        if (err) return done(err);
        contents.should.eql([
          'blob.js',
          'git-object.js',
          'object.js',
          'tree.js'
        ]);
        done();
      });
    });
  });
});
