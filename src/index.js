'use strict'

const Conf = require('conf')
const config = require('./config')

const cliConfig = new Conf()
cliConfig.set('accountsUrl', config.accountsUrl)

module.exports = require('@oclif/command')
