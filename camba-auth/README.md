<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Camba Auth v0.0.1

API that manage authorization and authentication for CAMBA app

## Cloning repository

```bash
$ git clone git@github.com:cristianquaglio/camba.git
```
## Setting env files

```bash
$ mv template.env.development .env.development
$ mv template.env.production .env.production
```
## Installation

```bash
$ yarn install
```
o simplemente:
```bash
$ yarn
```
## Creating containers (docker-compose)

```bash
$ docker-compose up -d
```



## (Optional) Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## (Optional) Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
