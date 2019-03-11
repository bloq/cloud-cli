'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const { Command } = require('@oclif/command')
const config = require('../config')

function isEmailValid (email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
  return regex.test(String(email).toLowerCase())
}

class SignupCommand extends Command {
  async run () {
    consola.info('☁️  Welcome to BloqCloud!')
    consola.info('We will guide you to create your new account')

    config.delete('user')
    config.delete('accessToken')
    config.delete('clientToken')
    config.delete('clientId')
    config.delete('clientSecret')

    const { email, displayName, password, confirmPassword, acceptTerms } = await inquirer.prompt([
      { name: 'email', message: 'Enter your email address', type: 'input' },
      { name: 'displayName', message: 'Enter your name', type: 'input' },
      { name: 'password', message: 'Enter your password', type: 'password' },
      { name: 'confirmPassword', message: 'Confirm new password', type: 'password' },
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

    if (!isEmailValid(email)) {
      return consola.error('The email address is invalid')
    }

    if (password !== confirmPassword) {
      return consola.error('The passwords you entered do not match')
    }

    const url = `${config.get('services.accounts.url')}/user/signup`
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
