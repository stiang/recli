var r    = require('rethinkdb'),
    repl = require('repl')
    util = require('util'),
    misc = require('./lib/misc'),
    opts = require('optimist')
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
          var local = repl.start({prompt: "recli> ",
                                  eval:   misc.replEval});
          local.context.r = r;
          local.context.conn = conn;
          local.context.db = opts.database;
        }
      }
    });
  }
};

exports.recli();
