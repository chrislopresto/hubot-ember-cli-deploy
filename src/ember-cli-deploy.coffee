# Description
#   A Hubot script for Ember CLI Deploy
#
# Configuration:
#   HUBOT_EMBER_CLI_DEPLOY_GITHUB_TOKEN: required
#
# Commands:
#   hubot ember deploy <app> <options> - deploys an ember app with ember-cli-deploy
#   continuous deployment - chimes in when the conversation gets rad
#
# Notes:
#   <optional notes required for the script>
#
# Author:
#   Chris LoPresto <chris@chrislopresto.com>

nodegit = require('nodegit')
fs = require('fs-extra')
path = require('path')
GITHUB_TOKEN = process.env.HUBOT_EMBER_CLI_DEPLOY_GITHUB_TOKEN
scriptRootDirName = 'hubot-ember-cli-deploy'

module.exports = (robot) ->
  robot.respond /ember deploy\s+(.+)/, (res) ->
    deployArgs = res.match[1]
    appName = deployArgs.split(" ")[0]

    localPath = path.join(__dirname, '..', scriptRootDirName, appName)
    fs.ensureDirSync(localPath)
    cloneURL = 'https://github.com/chrislopresto/bateman-ember'
    # cloneURL = 'https://github.com/yappbox/account'
    cloneOptions =
      remoteCallbacks: certificateCheck: ->
        # OS X HACK supposedly necessary according to
        # http://www.nodegit.org/guides/cloning/gh-two-factor/
        1
      credentials: ->
        # Not working with private repo yet
        nodegit.Cred.userpassPlaintextNew GITHUB_TOKEN, 'x-oauth-basic'
    cloneRepository = nodegit.Clone(cloneURL, localPath, cloneOptions)

    errorAndAttemptOpen = ->
      nodegit.Repository.open local

    cloneRepository.catch(errorAndAttemptOpen).then (repository) ->
      # Access any repository methods here.
      console.log 'Is the repository bare? %s', Boolean(repository.isBare())
      return

  robot.hear /continuous deployment/, (res) ->
    res.send "rad"
