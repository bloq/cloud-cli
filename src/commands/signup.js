'use strict'

const Conf = require('conf')
const config = new Conf()

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const { Command } = require('@oclif/command')

const { accountsUrl } = require('../config')

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
    config.delete('clientId')
    config.delete('clientSecret')

    const { email, displayName, password, confirmPassword, acceptTerms } = await inquirer.prompt([
      { name: 'email', message: 'Enter your email address', type: 'input' },
      { name: 'displayName', message: 'Enter your name', type: 'input' },
      { name: 'password', message: 'Enter your password', type: 'password' },
      { name: 'confirmPassword', message: 'Confirm new password', type: 'password' },
      { name: 'acceptTerms', message: 'Do you accept our terms & conditions? You can read them at https://terms.bloq.cloud', type: 'confirm' }, // eslint-disable-line
    ])

    if (!acceptTerms) {
      return consola.error('Termsn & Conditions must be accepted in order to create a bloq cloud account.') // eslint-disable-line
    }

    if (!isEmailValid(email)) {
      return consola.error('The email address is invalid')
    }

    if (password !== confirmPassword) {
      return consola.error('The passwords you entered do not match')
    }

    const url = `${accountsUrl}/user/signup`
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
        return consola.error(`Error creating BloqCloud account: ${data.body.code || data.body.message}`)
      }

      consola.success(`Generated new BloqCloud account. Your user id is: ${data.body.id}`)
      consola.info('Email sent to confirm your account.')
    })
  }
}

SignupCommand.description = 'Setup a new BloqCloud account'

module.exports = SignupCommand
