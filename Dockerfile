FROM node:20-alpine AS dist

RUN apk add --no-cache make gcc g++ python3
RUN ulimit -c unlimited

COPY package.json ./
RUN npm install

COPY . ./
RUN npm rebuild bcrypt --build-from-source
RUN npm run build

FROM node:20-alpine AS node_modules
RUN apk add --no-cache make gcc g++ python3
RUN ulimit -c unlimited
COPY package.json ./
RUN npm install

FROM node:20-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache make gcc g++ python3
RUN npm install -g npm@latest
RUN ulimit -c unlimited

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules
COPY . /usr/src/app/

CMD [ "npm", "run", "start:prod" ]
