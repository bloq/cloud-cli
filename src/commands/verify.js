'use strict'

const ora = require('ora')
const request = require('request')
const consola = require('consola')
const inquirer = require('inquirer')
const { Command, flags } = require('@oclif/command')

const { isUserValid, isUuidValid } = require('../validator')
const config = require('../config')

class VerifyCommand extends Command {
  async run () {
    consola.info('Verifyng your BloqCloud account.')
    const { flags } = this.parse(VerifyCommand)
    let { user, token } = flags

    if (!user) {
      const prompt = await inquirer.prompt([
        { name: 'user', message: 'Enter your account id', type: 'input', validate: isUserValid },
      ])
      user = prompt.user
    }

    if (!token) {
      const prompt = await inquirer.prompt([
        { name: 'token', message: 'Enter your verification token', type: 'input', validate: isUuidValid }
      ])
      token = prompt.token
    }

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users/${user}/token/${token}`
    console.log(url)
    const spinner = ora().start()

    request.put(url, {}, function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error verifying your account: ${err}`)
      }

      if (data.statusCode === 404) {
        return consola.error('User does not exist')
      }

      if (data.statusCode === 400) {
        return consola.error('Invalid verification token')
      }

      consola.success(`The account with id ${data.body.id} has been validated.`)
      consola.info(`You can now start a new session running the command: bcl login -u ${user}`)
    })
  }
}

VerifyCommand.description = 'Verifies your BloqCloud account and complete signup process'

VerifyCommand.flags = {
  user: flags.string({ char: 'u', description: 'bloqcloud account id' }),
  token: flags.string({ char: 't', description: 'verification token' })
}

module.exports = VerifyCommand
