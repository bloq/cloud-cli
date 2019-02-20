'use strict'

const Conf = require('conf')
const config = new Conf()

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

    const { email, displayName, password, confirmPassword, confirm } = await inquirer.prompt([
      { name: 'email', message: 'Enter your email address', type: 'input' },
      { name: 'displayName', message: 'Enter your name', type: 'input' },
      { name: 'password', message: 'Enter your password', type: 'password' },
      { name: 'confirmPassword', message: 'Confirm enter new password', type: 'password' },
      { name: 'confirm', message: 'Please check that your information is correct, do you want to continue?', type: 'confirm' }
    ])

    if (!confirm) {
      return consola.error('BloqCloud signup aborted')
    }

    if (!isEmailValid(email)) {
      return consola.error('The email address is invalid')
    }

    if (password !== confirmPassword) {
      return consola.error('The password you entered does not match each oder')
    }

    consola.info('Creating your new BloqCloud account')
    const url = `${accountsUrl}/user/signup`

    request.post(url, {
      json: {
        email,
        displayName,
        password
      }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to create the BloqCloud account: ${err}`)
      }

      if (data.statusCode !== 201) {
        return consola.error(`Error trying to create the BloqCloud account: ${data.body.code}`)
      }

      consola.success(`Generated new bloq account, you user id is: ${data.body.id}`)
      consola.info('We sent you an email to confirm your account.')
    })
  }
}

SignupCommand.description = 'setup a new bloqcloud account'

module.exports = SignupCommand
