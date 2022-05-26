'use strict'

const consola = require('consola')
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')
const config = require('../config')

class LogoutCommand extends Command {
  async run() {
    const user = config.get('user')
    consola.info(
      user ? `Clearing local data for ${user}` : 'Clearing local data'
    )

    const { confirmation } = await inquirer.prompt([
      {
        name: 'confirmation',
        message:
          'All your local data will be removed. Do you want to continue?',
        type: 'confirm'
      }
    ])

    if (!confirmation) {
      consola.info('Logout aborted.')
      return
    }

    consola.success('All your local data was removed')
    config.clear()
  }
}

LogoutCommand.description = 'Clear local user data'

module.exports = LogoutCommand
