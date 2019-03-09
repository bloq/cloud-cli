'use strict'

const request = require('request')
const consola = require('consola')
const inquirer = require('inquirer')
const { Command } = require('@oclif/command')
const { isUserValid, isUuidValid } = require('../validator')
const config = require('../config')

class VerifyCommand extends Command {
  async run () {
    consola.info('Verifyng your BloqCloud account.')
    const { user, token } = await inquirer.prompt([
      { name: 'user', message: 'Enter your account id', type: 'input', validate: isUserValid },
      { name: 'token', message: 'Enter your verification token', type: 'input', validate: isUuidValid }
    ])

    const url = `${config.get('services.accounts.url')}/user/${user}/token/${token}`
    request.post(url, {}, function (err, data) {
      if (err) {
        return consola.error(`Error verifying your account: ${err}`)
      }

      if (data.statusCode === 404) {
        return consola.error('User does not exist')
      }

      if (data.statusCode === 400) {
        return consola.error('Invalid verification token')
      }

      const body = JSON.parse(data.body)

      consola.success(`The account with id ${body.id} has been validated.`)
      consola.info(`You can now start a new session running the command: bcl login -u ${body.id}`)
    })
  }
}

VerifyCommand.description = 'Verifies your BloqCloud account and complete signup process'

module.exports = VerifyCommand
