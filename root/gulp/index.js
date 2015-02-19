var fs = require('fs');
var onlyScripts = require('./util/scriptFilter');
var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts.file); //Filter out DS_STORE files for instance

tasks.forEach(function(task) {
  require('./tasks/' + task);
});