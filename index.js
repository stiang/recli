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
          var cli = repl.start({prompt:    "recli> ",
                                eval:      misc.replEval,
                                writer:    function(result) {
                                  return util.inspect(result, {depth: null, colors: true});
                                } });
          cli.context.r = r;
          cli.context.conn = conn;
          cli.context.db = opts.database;
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
