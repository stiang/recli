## recli - RethinkDB CLI query tool and REPL
**recli** is a command-line query tool and REPL for RethinkDB, with lots of options to control its output. It supports regular javascript syntax and CoffeeScript syntax.

### Installation
Install recli using npm:
```
sudo npm install -g recli
```
This will give you a global `recli` command. If you prefer to install it locally, just drop the "sudo" and "-g".
In that case, you can invoke it like so:
```
node ./node_modules/recli
```
or
```
./node_modules/recli/bin/recli.js
```

### Usage
recli can either take a ReQL expression as an argument or be used as a REPL, which lets you type in ReQL expressions in a special shell and see the results immediately.

Here’s how you would use it from the command line:
```
$ recli 'r.table("bikes")'
... (JSON output) ...

$ recli 'r.table("bikes").get("123").update({foo: "bar"})'
... (JSON output) ...
```

If you don’t supply a ReQL expression on the command-line, recli will start a REPL for ReQL queries, like so:
```
$ recli
recli> r.table("bikes")
... (JSON output) ...
recli> r.table("bikes").get("123").update({foo: "bar"})
... (JSON output) ...
```
Note that results from queries that return a cursor are automatically converted to arrays and printed as JSON documents.

### Output
The output from recli is JSON straight from RethinkDB, but it is color-coded and pretty-formatted by node. This means that it is (by default) not strictly valid JSON:
```js
$ recli 'r.table("heroes")'
[ { hero: 'Magneto',
    name: 'Max Eisenhardt',
    aka: ['Magnus', 'Erik Lehnsherr', 'Lehnsherr'],
    magazine_titles:
     [ 'Alpha Flight',
       'Avengers',
       'Avengers West Coast' ],
    appearances_count: 42 },
  { hero: 'Professor Xavier',
    name: 'Charles Francis Xavier',
    magazine_titles:
     [ 'Alpha Flight',
       'Avengers',
       'Bishop',
       'Defenders' ],
    appearances_count: 72 },
  { hero: 'Storm',
    name: 'Ororo Monroe',
    magazine_titles:
     [ 'Amazing Spider-Man vs. Wolverine',
       'Excalibur',
       'Fantastic Four',
       'Iron Fist' ],
    appearances_count: 72 } ]
```
Colors can be disabled by using the `-n`/`--no-colors` option.

If you want valid JSON, but still nicely indented and readable, use the `-j`/`--json` option:
```
$ recli -j 'r.table("heroes")'
[ 
  { 
    "hero": "Magneto",
    "name": "Max Eisenhardt",
    "aka": [
      "Magnus", 
      "Erik Lehnsherr", 
      "Lehnsherr"
    ],
    "magazine_titles": [ 
      "Alpha Flight",
      "Avengers",
      "Avengers West Coast"
    ],
    "appearances_count": 42
  },
  { 
    "hero": "Professor Xavier",
    "name": "Charles Francis Xavier",
    "magazine_titles": [
      "Alpha Flight",
      "Avengers",
      "Bishop",
      "Defenders"
    ],
    "appearances_count": 72
  },
  { 
    "hero": "Storm",
    "name": "Ororo Monroe",
    "magazine_titles": [
      "Amazing Spider-Man vs. Wolverine",
      "Excalibur",
      "Fantastic Four",
      "Iron Fist"
    ],
    "appearances_count": 72
  }
]
```

If you want raw, unformatted and unindented JSON, use the `-r`/`--raw` option. This isn’t straight-from-the-wire raw, though, it is the JSON.stringify-ed version of the RethinkDB result data (as returned by the javascript driver).

### CoffeeScript input
If you prefer to use the CoffeeScript syntax, use the `-c`/`--coffee` option:
```
$ recli -c 'r.table "bikes"'
... (JSON output) ...
```

### Database and connection options
You can specify the database, host and port to connect to with the `-d`/`--database`, `-h`/`--host` and `-p`/`--port` options. 

Use `--help` to get the full usage info:
```
$ recli --help
Usage: recli [options] [ReQL expression]

REPL mode:
    If the ReQL expression is omitted, recli will enter REPL mode,
    which is a CLI where you can evaluate ReQL expressions.

REQL EXPRESSION:
    A ReQL expression is anything that works in RethinkDB's Data
    Explorer, for example

          r.table('bikes').filter({brand: 'Scott'})

          r.table('bikes').get('123').update({foo: 'bar'})

OPTIONAL options:
    -c, --coffee               Evaluate code as CoffeeScript.

    -d, --database DATABASE    Default database to perform queries against.
                               Can be overridden in the ReQL expression.
                               The default is 'test'.

    -h, --host HOST            Host to connect to. The default is 'localhost'.

    -j, --json                 Output valid, indented JSON instead of letting
                               node pretty-print the result.

    -n, --no-colors            Do not pretty-print with colors.

    -p, --port PORT            TCP port to connect to. The default is 28015.

    -r, --raw                  Print the raw JSON from RethinkDB, with no
                               formatting applied.

    -v, --version              Print the current version of recli.
```

### Author
Stian Grytøyr

### Contributors
* Luc Heinrich
* Marshall Cottrell

### Licence
[The MIT License](http://opensource.org/licenses/MIT)
