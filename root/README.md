# <%= title %>
===========

> <%= description %>

## Features
- Stylus + Autoprofixer + Nib + Source Mapping
- Livereload
- Server NodeJS (Express)
- Dot.js (templating) for both server and client side.
- Browserify + Backbone + Source Mapping
- SEO Friendly
- JS none-obstrusive
- Pre-rendered pages

## Quickstart
To setup this project on your local machine:

- Gulp
```
$ npm install -g gulp
```

- NPM dependencies (should have been run before with Slush)
```
npm install
```

## Server-side

The server runs with NodeJS and the Express framework. There's basically 3 modules:
- api
- front-end
- back-end

Running the server :

```
$ NODE_ENV=development_app node server/server.js
```

Available environements:

- development_app: /app folder (with sources)
- development_dist: /dist folder (ready for staging or production)
- staging
- production

## API

This module provides an API for clients (website, app...).

## Front-end

This module supports multilingue routing, caching and rendered views using the Dot.js template engine.
We use dot.js in order to share templates between both server and client side. 
We use a /datas folder which handles the configuration of each environnement + a description of each page for:
- setting up the controllers
- setting up the translations
- generate a JSON file for the front-end side routing + datas.

Each environement has its own configuration in /server/modules/frontend/datas/env.json

## Back-end

The administration module.