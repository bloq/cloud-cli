'use strict'

const consola = require('consola')
const { Command, flags } = require('@oclif/command')
const inquirer = require('inquirer')
const config = require('../config')
const { formatResponse } = require('../utils')

class LogoutCommand extends Command {
  async run() {
    const { flags } = this.parse(LogoutCommand)
    const isJson = typeof flags.json !== 'undefined'

    const user = config.get('user')
    !isJson &&
      consola.info(
        user ? `Clearing local data for ${user}` : 'Clearing local data'
      )

    const prompt = await inquirer.prompt([
      {
        name: 'yes',
        message:
          'All your local data will be removed. Do you want to continue?',
        type: 'confirm',
        when: () => !flags.json && !flags.yes
      }
    ])

    const { yes } = {
      ...prompt
    }

    if (!yes && !flags.yes && !flags.json) {
      formatResponse(isJson, 'Logout aborted.')
      return
    }

    formatResponse(isJson, 'Logout successful, all your local data was removed')
    config.clear()
  }
}

LogoutCommand.description = 'Clear local user data'
LogoutCommand.flags = {
  json: flags.boolean({ char: 'j', description: 'JSON output' }),
  yes: flags.boolean({
    char: 'y',
    description: 'answer "yes" to prompts',
    default: false
  })
}
module.exports = LogoutCommand
