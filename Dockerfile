FROM rethinkdb

# just add npm and recli
RUN apt update && apt install -y npm
RUN npm i -g recli
