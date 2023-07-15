FROM node:18 as builder

WORKDIR /usr/src/app

# Due to the application being a monorepo and utilizing workspaces we need to have all the various package.json
# files available to the `npm ci` command. The easiest way to do this for a multi-stage build is to copy the
# entire project structure over then remove the files we don't need.
#RUN mkdir -p packages/cli/ && \
#    mkdir -p packages/identity/ && \
#    mkdir -p packages/sdk-node/
#
#COPY package*.json ./
#COPY packages/cli/package*.json ./packages/cli/
#COPY packages/identity/package*.json ./packages/identity/
#COPY packages/sdk-node/package*.json ./packages/sdk-node/
#
#RUN ls -al ./packages/ && echo " -- " && ls -al ./packages/cli/ && echo " -- " && ls -al ./packages/identity/ && echo " -- " && ls -al ./packages/sdk-node/ && rm package-lock.json && npm i

# RUN npm ci
COPY . .
RUN rm -f package-lock.json && npm install
RUN npm run build

###########################
FROM node:18-alpine
ARG SERVICE

WORKDIR /usr/src/app

COPY packages/$SERVICE/package*.json ./
COPY packages/$SERVICE/config/default.js ./config/default.js
RUN npm install --only=prod

COPY --from=builder /usr/src/app/packages/$SERVICE/dist .
EXPOSE 8888

CMD [ "node", "./server.js" ]
# To ship logs to the ELK stack extend the above command
# with either pino-socket, pino-logstash or mds-log-pump.
# An example using mds-log-pump can be found in the mds
# stack configurations. This utilizes a simple config file
# and allows a out-of-process to handle shipping logs to
# the ELK stack.
#
# If you chose to use pino-socket or pino-logstash you will
# need to refer to their documentation for configuration.
#
# Ex: CMD [ "node", "./server.js", "|", "mds-log-pump"]
# Ex: CMD [ "node", "./server.js", "|", "pino-logstash", "-h", "elk", "-p", "5000" ]
# Ex: CMD [ "node", "./server.js", "|", "pino-socket", "-h", "elk", "-p", "5000" ]