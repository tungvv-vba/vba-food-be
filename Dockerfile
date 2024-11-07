FROM node:18 AS dist

RUN ulimit -c unlimited

COPY package.json ./
RUN npm install

COPY . ./
RUN npm rebuild bcrypt --build-from-source
RUN npm run build

FROM node:18 AS node_modules
RUN ulimit -c unlimited
COPY package.json ./
RUN npm install

FROM node:18-alpine
WORKDIR /usr/src/app
RUN ulimit -c unlimited

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules
COPY . /usr/src/app/

CMD [ "npm", "run", "start:prod" ]
