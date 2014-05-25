var through = require('through2'),
    exec = require('child-process-promise').exec,
    gutil = require('gulp-util'),
    path = require('path'),
    partial = require('partial'),
    _ = require('underscore'),
    Q = require('q'),
    FS = require('q-io/fs')

const PLUGIN_NAME = "gulp-fontcustom"

var toArgumentArray = function(src) {
  return _.reduceRight(src, function(prev, val, key) {
    return prev.concat("--"+key, val)
  }, [])
}

module.exports = function(options) {

  var cmd = 'fontcustom compile',

      defaults = {
        no_hash: true,
        force: true
      }

  options = _.extend({}, defaults, options)

  var tmp = options.output = './___tmp___'

  var getGeneratedFiles = function() {
    return FS.list(tmp)
  }

  var createVinylFromFile = function(file, generatedFile) {
    var tmpFile = path.join(tmp, generatedFile)

    return FS.read(tmpFile, { flags: 'b' }).then(function(contents) {
      var deferred = Q.defer()

      var vinyl = new gutil.File({
        cwd: file.cwd,
        base: file.base,
        path: file.base + generatedFile
      })

      try {
        vinyl.contents = contents
        deferred.resolve(vinyl)
      }
      catch(e) {
        deferred.reject(e)
      }

      return deferred.promise
    })
  }

  var collectIcons = function(source, enc, done) {
    var stream = this

    if(source.isNull()) {
      stream.push(source)
      return done()
    }

    if(source.isStream()) {
      stream.emit('error', new gutil.PluginError(PLUGIN_NAME, "Streams aren't supported"))
      return done()
    }

    if('.svg' !== path.extname(source.path)) {
      stream.push(source)
      return done()
    }

    var input = path.dirname(source.path),
        args = toArgumentArray(options)

    // fontcustom compile /___tmp___ --output <output> [other options]
    exec([cmd, input].concat(args).join(' '))
      .then(getGeneratedFiles)
      .then(function(files) {
        // Create a partially applied function with a fixed 'file' argument
        var createVinyl = partial(createVinylFromFile, source)

        return Q.all( files.map(function(file) {
          return createVinyl(file).then(function(vinyl) {
            return stream.push(vinyl)
          })
        }) )
    })
    .fin(function() {
      // Always do cleanup
      FS.removeTree(tmp)
    })
    .catch(function(err) {
      stream.emit('error', new gutil.PluginError(PLUGIN_NAME, err))
    })
    .done(function() {
      // Finish stream
      done()
    })
  }

  return through.obj(collectIcons)
}
