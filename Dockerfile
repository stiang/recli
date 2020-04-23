FROM rethinkdb

# just add npm and recli
RUN apt update && apt install -y npm git
RUN npm i -g git://github.com/superloach/recli
