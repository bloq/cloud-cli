'use strict'

const Conf = require('conf')
const config = require('./config')

require('./updater')

const cliConfig = new Conf()

if (!cliConfig.get('setup')) {
  cliConfig.set('accountsUrl', config.accountsUrl)
  cliConfig.set('setup', true)
}

module.exports = require('@oclif/command')
