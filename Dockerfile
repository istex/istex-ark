FROM node:6.9.1

# to help docker debugging
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install vim curl

# install nodejs dependencies
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm config set strict-ssl false && \
    npm install -q --production && \
    npm cache clean

# ezmasterization of istex-ark:
# creates the /etc/ezmaster.json in the docker image.
# It will tell to ezmaster where is your web server (ex: port 3000),
# where is your JSON configuration file,
# and where is your data folder
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/app/dump/istexid-ark.json", \
  "dataPath": "" \
}' > /etc/ezmaster.json
EXPOSE 3000

# copy source code
COPY . /app

CMD npm start