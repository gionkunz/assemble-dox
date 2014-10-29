var dox = require('dox');
var _ = require('lodash');

module.exports = function (params, next) {
  var defaultOptions = {
    contextRoot: 'dox',
    sourceFiles: [],
    doxOptions: {}
  };

  var context = params.context;
  var options = _.extend({}, defaultOptions, params.assemble.options.dox);
  var grunt = params.grunt;
  var commentCount = 0;

  grunt.log.subhead('Assemble Dox is crunching source files');
  grunt.verbose.writeln('Using options ' + JSON.stringify(options));

  context[options.contextRoot] = grunt.file.expand(options.sourceFiles).filter(function(sourceFilePath) {
    return grunt.file.isFile(sourceFilePath);
  }).map(function(sourceFilePath) {
    grunt.verbose.writeln('Parsing comments in file ' + sourceFilePath);
    var comments = dox.parseComments(grunt.file.read(sourceFilePath), options.doxOptions);
    commentCount += comments.length;

    return {
      file: sourceFilePath,
      comments: comments
    }
  });

  grunt.log.writeln(commentCount + ' comments provided to context.' + options.contextRoot);

  next();
};
