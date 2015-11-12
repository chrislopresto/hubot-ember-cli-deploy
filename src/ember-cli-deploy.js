/* globals require, process, module */
// Description
//   A Hubot script for Ember CLI Deploy
//
// Configuration:
//   HUBOT_EMBER_CLI_DEPLOY_GITHUB_TOKEN: required
//
// Commands:
//   hubot ember deploy <app> <options> - deploys an ember app with ember-cli-deploy
//   continuous deployment - chimes in when the conversation gets rad
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Chris LoPresto <chris@chrislopresto.com>

var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;
var GITHUB_TOKEN = process.env.HUBOT_EMBER_CLI_DEPLOY_GITHUB_TOKEN;
var scriptRootDirName = 'hubot-ember-cli-deploy';

module.exports = function(robot) {
  robot.respond(/ember deploy\s+(.+)/, function(res) {
    var deployArgs = res.match[1];
    var appName = deployArgs.split(' ')[0];
    var localPath = path.join('/tmp', scriptRootDirName, appName);
    console.log('localPath', localPath);
    fs.ensureDirSync(localPath);
    var repoName = deployArgs;
    var repoUrl = 'https://' + GITHUB_TOKEN +
      ':x-oauth-basic@github.com/' +
      repoName + '.git';

    console.log('Cloning: ', repoUrl);

    var deploy = 'if [ -d .git ] || git rev-parse --git-dir > /dev/null 2>&1 ; ' +
      'then git pull ' + repoUrl + ' ; ' +
      'else cd .. && git clone ' + repoUrl + ' && cd ' + localPath + ' ; fi ; ' +
      'npm install ; ' +
      'bower install ; ' +
      'ember deploy prod --activate';
    console.log('executing ', deploy);
    exec(deploy, { cwd: localPath }, function(err, stdout, stderr) {
      if (err) {
        console.log('Deploy of ' + appName + ' failed with error code: ', err.code);
        res.send('Deploy of ' + appName + ' failed with error code: ' + err.code);
      }
      res.send(':shipit:');
      console.log('deploy stdout', stdout);
      console.log('deploy stderr', stderr);
    });

    return res.send('ok');
  });

  robot.hear(/continuous deployment/, function(res) {
    return res.send('rad');
  });
};
