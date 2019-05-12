'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const { Command } = require('@oclif/command')

const config = require('../config')
const { isEmailValid, isNotEmpty, isPasswordValid, isPasswordEqual } = require('../validator')

class SignupCommand extends Command {
  async run () {
    consola.info('☁️  Welcome to BloqCloud!')
    consola.info('We will guide you to create your new account')

    config.delete('user')
    config.delete('accessToken')
    config.delete('clientToken')
    config.delete('clientId')
    config.delete('clientSecret')

    const { email, displayName, password } = await inquirer.prompt([
      { name: 'email', message: 'Enter your email address', type: 'input', validate: isEmailValid },
      { name: 'displayName', message: 'Enter your name', type: 'input', validate: isNotEmpty },
      { name: 'password', message: 'Enter your password', type: 'password', validate: isPasswordValid }
    ])

    const { acceptTerms } = await inquirer.prompt([
      { name: 'confirmPassword', message: 'Confirm new password', type: 'password', validate: value => isPasswordEqual(value, password) },
      {
        name: 'acceptTerms',
        message: 'Use of Bloq’s services is subject to the Terms of Service found at https://terms.bloq.cloud. \nPlease confirm that you have read and agree to the Terms of Service by selecting [“I accept”]',
        type: 'list',
        choices: ['Decline', 'I accept']
      }
    ])

    if (acceptTerms === 'Decline') {
      return consola.error('Terms & Conditions must be accepted in order to create a BloqCloud account and access BloqCloud services.') // eslint-disable-line
    }

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users`

    const { confirm } = await inquirer.prompt([
      { name: 'confirm', message: 'Please check that your information is correct. Do you want to continue?', type: 'confirm' } // eslint-disable-line
    ])

    if (!confirm) {
      return consola.error('BloqCloud signup aborted')
    }

    consola.info('Creating your new BloqCloud account')
    const spinner = ora().start()
    request.post(url, { json: { email, displayName, password } }, function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error creating BloqCloud account: ${err}`)
      }

      if (data.statusCode !== 201) {
        return consola.error(
          `Error creating BloqCloud account: ${data.body.code || data.body.message}`
        )
      }

      consola.success(`Generated new BloqCloud account. Your user id is: ${data.body.id}`)
      consola.info('Email sent to confirm your account.')
    })
  }
}

SignupCommand.description = 'Setup a new BloqCloud account'

module.exports = SignupCommand
