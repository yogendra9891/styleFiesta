var gilpJshint = require('gulp-jshint');
var gulp = require('gulp');
var path = require('path');
var shell = require('shelljs');
var fs = require('fs');
var stream = require('stream');
var assert = require('assert');

/**
 * Runs given command asynchronously using shelljs.exec() and calls callback with {code,output}.
 * For non zero code, an Error is passed as first argument of callback function.
 */
function shellExec(cmd, callback) {
  console.log("Executing shell command: " + cmd);
  shell.exec(cmd, function(code, output) {
    var error;
    if (code !== 0) {
      error = new Error("Shell command exit with error code " + code +
        " : " + output);
    }
    callback(error, {
      code: code,
      output: output
    });
  })
}

/**
 * Create a shellExec based transform stream..
 */
function shellExecStream() {
  var ss = new stream.Transform({
    objectMode: true
  });
  ss._transform = function(chunk, encoding, done) {
    shellExec(chunk, function(err, result) {
      if (err) {
        done(err);
      } else {
        ss.push(result);
        done();
      }
    });
  };
  return ss;
}

/**
 * Create a readable stream out of value(s).
 */
function valueSource(values) {
  var input = [];
  input = input.concat(values);
  var src = new stream.Readable({
    objectMode: true
  });
  src._read = function() {
    src.push(input.length > 0 ? input.pop() : null);
  };
  return src;
}

// Unit tests task
gulp.task('test', function() {

  // command variables
  var bin = path.join(__dirname, 'node_modules', '.bin');
  var xUnitFile = "export JUNIT_REPORT_PATH=" + path.join(__dirname,
    '.build', 'xunit.xml');
  var istanbul = path.join(bin, 'istanbul');
  var mocha = path.join(bin, '_mocha');

  // unit test command **REQUIRES UNIX SHELL**
  var cmd = xUnitFile + '; ' + istanbul + ' cover ' + mocha;

  // run tests command
  return valueSource(cmd).pipe(shellExecStream());
});

// jshint inspection
gulp.task('jshint', function() {
  // sources and report path
  var sources = ['./libs/**/*js', './models/**/*.js,', '.routes/**/*.js',
    './app.js', '.Controllers/**/*.js'
  ];
  var outfile = path.join(__dirname, '.build/jshint-checkstyle.xml');

  // clear any existing report first, otherwise reporting plugin mistakes old files for new.
  if (fs.existsSync(outfile)) {
    fs.unlinkSync(outfile);
  }

  // run jshint, and generate report in jenkins checkstyle format
  return gulp.src(sources)
    .pipe(gilpJshint())
    .pipe(gilpJshint.reporter('gulp-checkstyle-jenkins-reporter', {
      filename: outfile
    }));
});

// bump npm version (patch), make a git tag, package the latest git HEAD to version.zip i build dir.
gulp.task('release', function() {

  // get current package
  var pkg = JSON.parse(fs.readFileSync('./package.json'));

  // packaged output file
  var outfile = path.join(__dirname, '.build/release_' + pkg.version +
    '.zip');

  // run commands
  return valueSource('git archive -o ' + outfile + ' HEAD').pipe(
    shellExecStream());

});

// default task
gulp.task('default', ['jshint', 'test']);
