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

# copy source code
COPY . /app

CMD npm start
