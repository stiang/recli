var r      = require('rethinkdb'),
    coffee = require('coffee-script'),
    repl   = require('repl'),
    util   = require('util'),
    misc   = require('./lib/misc'),
    pj     = require('./package.json');
    opts   = require('optimist')
               .boolean(['c', 'colors', 'j', 'n', 'r', 'v'])
               .default('colors', true)
               .alias('c', 'coffee')
               .alias('d', 'database')
               .alias('h', 'host')
               .alias('j', 'json')
               .alias('p', 'port')
               .alias('r', 'raw')
               .alias('v', 'version')
               .argv;

var writer = function(rawResult) {
  var result;
  if (opts.raw) {
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
    if (opts.n) opts.colors = false;

    r.connect({
      host:    opts.host     || 'localhost',
      port:    opts.port     || 28015,
      db:      opts.database || 'test',
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
        }
      }
    });
  }
};

exports.recli();

