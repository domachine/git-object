
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

describe('fromPath', function(){
  it('should create a blob', function(done){
    fromPath('.', 'master', 'index.js', function(err, object){
      if (err) return done(err);
      assert.ok(object instanceof fromPath.Blob);
      var sink = new Sink(object.show());
      sink.on('data', function(d){
        d.toString().should.equal([
          '',
          '/**',
          ' * Module dependencies.',
          ' */',
          '',
          "var template = require('./lib/template');",
          '',
          '/**',
          ' * Module exports.',
          ' */',
          '',
          'exports.template = template;',
          ''
        ].join('\n'));
        done();
      });
    });
  });
  it('should create a tree', function(done){
    fromPath('test/node-odt.git', 'master', 'lib', function(err, object){
      if (err) return done(err);
      assert.ok(object instanceof fromPath.Tree);
      object.contents(function(err, contents){
        if (err) return done(err);
        contents.should.eql([
          'handler/',
          'odt-content.js',
          'template.js',
          'util.js'
        ]);
        done();
      });
    });
  });
});
