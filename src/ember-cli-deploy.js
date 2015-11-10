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

    var cloneRepository = nodegit.Clone(repoUrl, localPath, cloneOptions);

    var errorAndAttemptOpen = function() {
      return nodegit.Repository.open(localPath);
    };

    cloneRepository.catch(errorAndAttemptOpen).then(function(repository) {
      console.log('Is the repository bare? %s', Boolean(repository.isBare()));
    });
    return res.send('ok');
  });

  robot.hear(/continuous deployment/, function(res) {
    return res.send('rad');
  });
};
