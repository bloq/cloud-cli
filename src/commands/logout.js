'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const { accountsUrl } = require('../config')

class LogoutCommand extends Command {
  async run () {
    const user = config.get('user')

    consola.info(user ? `Clearing local data for ${user}` : 'Clearing local data')
    const { confirmation } = await inquirer.prompt([
      { name: 'confirmation', message: 'All your local data will be removed. Do you want to continue?', type: 'confirm' },
    ])

    if (!confirmation) {
      return consola.info('Logout aborted.')
    }

    consola.success('All your local data was removed')
    config.clear()
  }
}

LogoutCommand.description = 'Clear local user data'

module.exports = LogoutCommand
