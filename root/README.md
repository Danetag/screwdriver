# <%= title %>
===========

> <%= description %>

## Featuring
- Compass + SASS + Source Mapping
- Livereload
- Server NodeJS(Express)
- Dot.js (templating) both server and client side.

## Quickstart
To setup this project on your local machine:

- Gulp
```
$ npm install -g gulp
```

- Bundler (Bundle Gems)
```
$ gem update --system
$ gem install bundler
```

- NPM + Gems dependencies
```
bundle install
npm install
```

## Server-side

The server runs with NodeJS and the Express framework. There's basically 3 modules:
- api
- front-end
- back-end

## API

This module provides an API for clients (website, app...).

## Front-end

This module supports multilingue routing, caching and renders views with the Dot.js template engine.
We use dot.js in order to share templates between both server and client side. 

## Back-end

The administration module.