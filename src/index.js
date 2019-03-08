'use strict'

const config = require('./config')
const defaultConfig = require('./default-config')

require('./updater')

// Note: conf library throws when trying to access a boolean value from the
//       the terminal:
//       node bin/run conf isInitialized
//       TypeError: Invalid data, chunk must be a string or buffer, not boolean
if (config.get('isInitialized') !== 'true') {
  config.store = defaultConfig
  config.set('isInitialized', 'true')
}

module.exports = require('@oclif/command')
