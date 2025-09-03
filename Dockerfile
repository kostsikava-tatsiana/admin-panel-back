# syntax=docker/dockerfile:1
FROM node:lts-alpine AS base

WORKDIR /app

COPY package*.json ./
# Install with devDependencies so sequelize-cli is available inside the container
RUN npm ci || npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]


