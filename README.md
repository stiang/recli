## recli - RethinkDB CLI query tool and REPL
**recli** is a command-line query tool and REPL for RethinkDB. It let’s you do things like
```
$ recli 'r.table("bikes")'
... (JSON output) ...

$ recli 'r.table("bikes").get("123").update({foo: "bar"})'
... (JSON output) ...
```
If you don’t supply a ReQL expression on the command-line, recli will start a REPL for
ReQL queries, like so:
```
$ recli
recli> r.table("bikes")
... (JSON output) ...
recli> r.table("bikes").get("123").update({foo: "bar"})
... (JSON output) ...
```

The output from recli is JSON straight from RethinkDB. It is color-coded and pretty-formatted by node, 
but other than that it is not modified in any way.
```js
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
       'Iron Fist'],
    appearances_count: 72 } ]
```
Note that results from queries that return a cursor are automatically converted to arrays and printed as JSON documents.

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

### Options
You can specify the database, host and port to connect to. Use `--help` to get the full usage info:
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
    -d, --database DATABASE    Default database to perform queries against.
                               Can be overridden in the ReQL expression.
                               The default is 'test'.

    -h, --host HOST            Host to connect to. The default is 'localhost'.

    -p, --port PORT            TCP port to connect to. The default is 28015.
```

### Author
Stian Grytøyr

### Licence
[The MIT License](http://opensource.org/licenses/MIT)
