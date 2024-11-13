FROM node:20-alpine AS dist

RUN apk add --no-cache make gcc g++ python3
RUN ulimit -c unlimited

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

FROM node:20-alpine AS node_modules
RUN apk add --no-cache make gcc g++ python3
RUN ulimit -c unlimited
COPY package.json yarn.lock ./
RUN yarn install --prod

FROM node:20-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache make gcc g++ python3
RUN ulimit -c unlimited

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules
COPY . /usr/src/app/

CMD [ "yarn", "start:prod" ]
