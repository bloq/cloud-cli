'use strict'

const Conf = require('conf')
const config = new Conf()

const request = require('request')
const consola = require('consola')
const inquirer = require('inquirer')
const accountsUrl = 'http://localhost:4000'

const { Command } = require('@oclif/command')

class VerifyCommand extends Command {
  async run () {
    consola.info('Verifyng your BloqCloud account.')
    const { user, token } = await inquirer.prompt([
      { name: 'user', message: 'Enter your user id', type: 'input' },
      { name: 'token', message: 'Enter your verification token', type: 'input' }
    ])

    const url = `${accountsUrl}/user/${user}/token/${token}`
    request.post(url, {
    }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to verify your account: ${err}`)
      }

      if (data.statusCode === 404) {
        return consola.error('User does not exists.')
      }

      if (data.statusCode === 403) {
        return consola.error('Invalid verification token.')
      }

      const body = JSON.parse(data.body)

      consola.success(`The account with id ${body.id} was validated`)
      consola.info(`You can now start a new session running the command: bcl login -u ${body.id}`)
    })
  }
}

VerifyCommand.description = 'verifies your account and finish signup process'

module.exports = VerifyCommand
