'use strict'

const ora = require('ora')
const fetch = require('node-fetch').default
const consola = require('consola')
const inquirer = require('inquirer')
const { Command, flags } = require('@oclif/command')

const { isUserValid, isUuidValid } = require('../validator')
const config = require('../config')

class VerifyCommand extends Command {
  async run() {
    consola.info('Verifyng your Bloq account.')
    const { flags } = this.parse(VerifyCommand)
    let { user, token } = flags

    if (!user) {
      const prompt = await inquirer.prompt([
        {
          name: 'user',
          message: 'Enter your email address or account id',
          type: 'input',
          validate: isUserValid
        }
      ])

      user = prompt.user
      if (!user) {
        return consola.error('Missing email or account id')
      }
    }

    if (!token) {
      const prompt = await inquirer.prompt([
        {
          name: 'token',
          message: 'Enter your verification token',
          type: 'input',
          validate: isUuidValid
        }
      ])

      token = prompt.token
      if (!token) {
        return consola.error('Missing verification token')
      }
    }

    const env = config.get('env') || 'prod'
    const url = `${config.get(
      `services.${env}.accounts.url`
    )}/users/${user}/token/${token}`

    const spinner = ora().start()

    const params = {
      method: 'PUT'
    }

    fetch(url, params)
      .then(res => {
        spinner.stop()

        if (res.status === 404) {
          return consola.error('User does not exist')
        }

        if (res.status === 204) {
          consola.success(`The account ${user} has been validated.`)
          return consola.info(
            `You can now start a new session running the command: bcl login -u ${user}`
          )
        }
        return res.json()
      })
      .then(function (res) {
        if (res.code === 'UserVerified') {
          return consola.warn(`Your account is already verified
          To start a new session run the command: bcl login -u ${user}`)
        }

        return consola.error(`Error verifying your account: ${res.code}`)
      })
      .catch(err => consola.error(`Error verifying your account: ${err}`))
  }
}

VerifyCommand.description =
  'Verifies your Bloq account and complete signup process'

VerifyCommand.flags = {
  user: flags.string({ char: 'u', description: 'email address or account id' }),
  token: flags.string({ char: 't', description: 'verification token' })
}

module.exports = VerifyCommand
