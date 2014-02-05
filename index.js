var r      = require('rethinkdb'),
    coffee = require('coffee-script'),
    repl   = require('repl'),
    util   = require('util'),
    misc   = require('./lib/misc'),
    opts   = require('optimist')
               .boolean('c')
               .alias('c', 'coffee')
               .alias('d', 'database')
               .alias('h', 'host')
               .alias('p', 'port')
               .argv;

exports.recli = function() {
  if (opts.help) {
    misc.usage();
  } else {
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
          if (opts.coffee) {
            opts._[0] = coffee.compile(opts._[0], { bare: true });
          }

          var re = eval(opts._[0]);
          misc.evalResult(conn, re, function(e, result) {
            if (e) {
              throw e;
            } else {
              console.log(util.inspect(result, {depth: null, colors: true}));
              process.exit();
            }
          });
        } else {
          var cli = repl.start({prompt:    "recli> ",
                                eval:      misc.replEval,
                                writer:    function(result) {
                                  return util.inspect(result, {depth: null, colors: true});
                                } });
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
