FROM --platform=linux/amd64 node:20-alpine
WORKDIR /usr/src/app
COPY . ./service
WORKDIR /usr/src/app/service
RUN yarn --production

EXPOSE 3000

CMD ["node", "src/server.js"]