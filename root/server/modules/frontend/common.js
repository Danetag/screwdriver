var env   = require('./datas/env.json');
var pages = require('./datas/pages.json');

exports.pages = function() {
  return pages.pages;
}

exports.config = function() {

  var node_env = process.env.NODE_ENV || 'development_app';
  var environnement = env[node_env];

  if (environnement === undefined) {
    console.log('Environnement "' + node_env + '" not found. Env "development_app" is used instead.');
    environnement = env['development_app'];
  }

  environnement.node_env = node_env;

  return environnement;
};
