FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json .

RUN  yarn install

COPY . .

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]