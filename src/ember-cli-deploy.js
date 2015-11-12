/* globals require, process, module, __dirname */
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

var nodegit = require('nodegit');
var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;
var GITHUB_TOKEN = process.env.HUBOT_EMBER_CLI_DEPLOY_GITHUB_TOKEN;
var scriptRootDirName = 'hubot-ember-cli-deploy';

module.exports = function(robot) {
  robot.respond(/ember deploy\s+(.+)/, function(res) {
    var deployArgs = res.match[1];
    var appName = deployArgs.split(' ')[0];
    var localPath = path.join(__dirname, '..', scriptRootDirName, appName);
    fs.ensureDirSync(localPath);
    var repoName = deployArgs;
    var repoUrl = 'https://' + GITHUB_TOKEN +
      ':x-oauth-basic@github.com/' +
      repoName + '.git';

    console.log('Cloning: ', repoUrl);

    var cloneOptions = {
      remoteCallbacks: {
        certificateCheck: function() {
          return 1;
        },
        credentials: function() {
          return nodegit.Cred.userpassPlaintextNew(GITHUB_TOKEN, 'x-oauth-basic');
        }
      }
    };

    var repository;
    nodegit.Clone(repoUrl, localPath, cloneOptions).then(function(response) {
      console.log('clone then', arguments);
      repository = response;
    }).catch(function() {
      console.log('clone catch', arguments);
      return;
    }).then(function() {
      if (repository) {
        console.log('Is the repository bare? %s', Boolean(repository.isBare()));
      }
      console.log('clone finally', arguments);
      var cdCommand = 'cd ' + localPath + ' && pwd && ';
      var deployCommand = 'npm install && bower install && ember deploy prod --activate';
      var cmd = cdCommand + deployCommand;
      console.log('executing ', cmd);
      exec(cmd, function(err, stdout, stderr) {
        console.log('stdout', stdout);
        console.log('stderr', stderr);
      });
    });

    return res.send('ok');
  });

  robot.hear(/continuous deployment/, function(res) {
    return res.send('rad');
  });
};
