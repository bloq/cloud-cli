'use strict'

const config = require('./config')
const { version } = require('../package.json')
const defaultConfig = require('./default-config')
require('./updater')

const configVersion = config.get('version')
const isInitialized = config.get('isInitialized')

if (isInitialized !== 'true' || !configVersion || version > configVersion) {
  config.store = Object.assign(config.store, defaultConfig)
  config.set('isInitialized', 'true')
}

module.exports = require('@oclif/command')
