FROM node:14-alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --omit=dev

# copy source code
COPY dump ./dump
COPY public ./public
COPY routes ./routes
COPY index.js .

ENTRYPOINT ["npm", "start"]
