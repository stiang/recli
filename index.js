var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var defaultConfigFile = home + '/.recli.yml';
var r      = require('rethinkdb'),
    rhist  = require('repl.history'),
    coffee = require('coffee-script'),
    repl   = require('repl'),
    util   = require('util'),
    os     = require('os'),
    fs     = require('fs'),
    yaml   = require('js-yaml'),
    misc   = require('./lib/misc'),
    pj     = require('./package.json');
    opts   = require('optimist')
               .boolean(['c', 'colors', 'j', 'n', 'r', 'v'])
               .default('colors', true)
               .default('file', defaultConfigFile)
               .alias('coffee',   'c')
               .alias('database', 'd')
               .alias('file',     'f')
               .alias('host',     'h')
               .alias('json',     'j')
               .alias('port',     'p')
               .alias('raw',      'r')
               .alias('stream',   's')
               .alias('version',  'v')
               .argv;

var writer = function(rawResult) {
  var result;
  if (opts.stream) {
    var i = 0;
    result = '';
    for (i in rawResult) {
      result += JSON.stringify(rawResult[i]) + os.EOL;
    }
  } else if (opts.raw) {
    result = JSON.stringify(rawResult);
  } else if (opts.json) {
    result = JSON.stringify(rawResult, null, 2);
  } else {
    result = util.inspect(rawResult, {depth: null, colors: opts.colors});
  }
  return result;
}

exports.recli = function() {
  if (opts.help) {
    misc.usage();
  } else if (opts.version) {
    console.log(pj.version);
  } else {
    var globalSettings = {};
    var userSettings   = {};
    if (opts.file) {
      // Only load global config file if a file has not been specified
      if (opts.file === defaultConfigFile) {
        try {
          globalSettings = yaml.safeLoad(fs.readFileSync('/etc/recli.yml', 'utf8'));
        } catch (e) {}
      }
      try {
        userSettings = yaml.safeLoad(fs.readFileSync(opts.file, 'utf8'));
      } catch (e) {}
    }
    opts = misc.setupOptions(opts, globalSettings, userSettings);

    r.connect({
      host:    opts.host,
      port:    opts.port,
      db:      opts.database,
      authKey: opts.auth
    }, function(err, conn) {
      if (err) {
        throw err;
      } else {
        if (opts._.length) {
          var code = opts._[0];
          if (opts.coffee) {
            code = coffee.compile(code, {bare: true});
          }

          var re = eval(code);
          misc.evalResult(conn, re, function(e, result) {
            if (e) {
              throw e;
            } else {
              console.log(writer(result));
              process.exit();
            }
          });
        } else {
          var cli = repl.start({prompt:    "recli> ",
                                eval:      misc.replEval,
                                writer:    writer});
          cli.context.r = r;
          cli.context.conn = conn;
          cli.context.coffee = opts.coffee;

          cli.on('exit', function () {
            console.log('');
            process.exit();
          });
          rhist(cli, home + '/.recli_history');
        }
      }
    });
  }
};

exports.recli();

