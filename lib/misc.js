var vm = require('vm');

// Make the rethinkdb result suitable for output
exports.evalResult = function(conn, result, callback) {
  result.run(conn, function(err, resultOrCursor) {
    if (err) {
      callback(err);
    } else {
      if (resultOrCursor) {
        if (typeof resultOrCursor.toArray === 'function') {
          resultOrCursor.toArray(function(e, arr) {
            callback(e, arr);
          });
        } else {
          callback(err, resultOrCursor);
        }
      } else {
        callback(null, null);
      }
    }
  });
}

// Custom eval function for the repl module
exports.replEval = function(code, context, file, cb) {
  var err, result, re;

  // first, create the Script object to check the syntax
  try {
    var script = vm.createScript(code, {
      filename: file,
      displayErrors: false
    });
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    return;
  }

  if (!err) {
    try {
      re = script.runInContext(context, { displayErrors: false });
    } catch (e) {
      console.log(e);
      console.log(e.stack);
      return;
    }
    exports.evalResult(context.conn, re, cb);
  }
}

exports.usage = function() {
  var usage = '\
Usage: recli [options] [ReQL expression]                                          \n\
                                                                                 \n\
REPL mode:                                                                       \n\
    If the ReQL expression is omitted, recli will enter REPL mode,                \n\
    which is a CLI where you can execute ReQL statements.                        \n\
                                                                                 \n\
REQL EXPRESSION:                                                                 \n\
    A ReQL expression is anything that works in RethinkDB\'s Data                \n\
    Explorer, for example                                                        \n\
                                                                                 \n\
          r.table(\'bikes\').filter({brand: \'Scott\'})                          \n\
                                                                                 \n\
          r.table(\'bikes\').get(\'123\').update({foo: \'bar\'})                 \n\
                                                                                 \n\
OPTIONAL options:                                                                \n\
    -d, --database DATABASE    Default database to perform queries against.      \n\
                               Can be overridden in the ReQL expression.         \n\
                               The default is \'test\'.                          \n\
                                                                                 \n\
    -h, --host HOST            Host to connect to. The default is \'localhost\'. \n\
                                                                                 \n\
    -p, --port PORT            TCP port to connect to. The default is 28015.     \n\
\n';
  console.log(usage);

}