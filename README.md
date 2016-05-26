## recli - RethinkDB CLI query tool and REPL
**recli** is a command-line query tool and REPL for RethinkDB, with lots of options to control its output. It supports regular JavaScript syntax and CoffeeScript syntax.

### Installation
Install recli using npm:
```
sudo npm install -g recli
```
This will give you a global `recli` command. If you prefer or need to install it locally, just drop the "sudo" and "-g". In that case, you can invoke it like so:
```
node ./node_modules/recli
```
or
```
./node_modules/recli/bin/recli.js
```

You can of course create an alias to be able to type "recli", as if you had recli installed globally, just put something like this in your ~/.bash_profile or equivalent:
```
alias recli='YOURDIR/node_modules/recli/bin/recli.js'
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
The default output from recli is a color-coded and pretty-formatted RethinkDB query result. It uses node’s util.inspect method, which means that it is actually a string representation of a Javascript object and NOT (by default) strictly valid JSON:
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
Note that colors can be disabled by using the `-n`/`--no-colors` option.

If you want valid JSON instead, but still nicely indented and readable, use the `-j`/`--json` option:
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

If you want raw, unformatted and unindented JSON, use the `-r`/`--raw` option. This isn’t straight-from-the-wire raw, though, it is the JSON.stringify-ed version of the RethinkDB result data (as returned by the JavaScript driver).

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

    -f, --file FILE            Read options from the supplied YAML config
                               file. The default is to look for a global 
                               /etc/recli.yml and user overrides in ~/.recli.yml

    -h, --host HOST            Host to connect to. The default is 'localhost'.

    -j, --json                 Output valid indented JSON instead of pretty-
                               printing the result.

    -n, --no-colors            Do not use colors when pretty-printing.

    -p, --port PORT            TCP port to connect to. The default is 28015.

    -r, --raw                  Print the raw JSON from RethinkDB, with no
                               formatting applied.

    -s, --stream               Print a line break delimited JSON stream with one
                               valid JSON object per line.

    -v, --version              Print the current version of recli.
```
Any options specified on the command line take precedence over defaults and configuration file settings.

Note that the `--coffee`, `--file`, `--json` and `--raw` options also support the `--no-<option>` syntax, like `--no-json`. This lets you override all configuration file settings.

### Configuration files
recli will look for YAML configuration files in `/etc/recli.yml` and `~/.recli.yml` by default. The user config overrides the global config. You can specify another configuration file by using the `-f`/`--file` option, in which case none of the default files are loaded.

The keys and values in the configuration files must match the (long-form) options that can be used on the command line (use `true` and `false` for flags):
```yaml
# set default connection options
database: mydb
host: server1

# output valid JSON by default
json: true

# prefer to use CoffeeScript input
coffee: true
```

### REPL history
recli remembers commands that you run in the REPL (between sessions), which gives you access to previously run commands by pressing arrow-up. The history is stored in ~/.recli_history. There is currently no way to disable the history feature.

### Author
Stian Grytøyr

### Contributors
* Luc Heinrich
* Marshall Cottrell
* StreetStrider
* Howard Tyson

### Licence
[The MIT License](http://opensource.org/licenses/MIT)
