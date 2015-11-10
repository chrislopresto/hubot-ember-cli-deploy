chai = require 'chai'
sinon = require 'sinon'
chai.use require 'sinon-chai'

expect = chai.expect

describe 'ember-cli-deploy', ->
  beforeEach ->
    @robot =
      respond: sinon.spy()
      hear: sinon.spy()

    require('../src/ember-cli-deploy')(@robot)

  it 'registers a respond listener', ->
    expect(@robot.respond).to.have.been.calledWith(/ember deploy\s+(.+)/)

  it 'registers a hear listener', ->
    expect(@robot.hear).to.have.been.calledWith(/continuous deployment/)
