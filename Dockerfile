FROM node:18 AS dist

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

FROM node:18 AS node_modules
COPY package.json yarn.lock ./
RUN yarn install --prod

FROM node:18-alpine
WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules
COPY . /usr/src/app/

CMD [ "yarn", "start:prod" ]
