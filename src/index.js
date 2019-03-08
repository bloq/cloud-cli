'use strict'

const config = require('./config')
const defaultConfig = require('./default-config')

require('./updater')

if (!config.get('isInitialized')) {
  config.store = defaultConfig
  config.set('isInitialized', true)
}

module.exports = require('@oclif/command')
