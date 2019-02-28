'use strict'

const Conf = require('conf')
const config = new Conf()

const ora = require('ora')
const request = require('request')
const consola = require('consola')
const inquirer = require('inquirer')

const { accountsUrl } = require('../config')

const { Command, flags } = require('@oclif/command')

class LoginCommand extends Command {
  async run () {
    consola.info('☁️  Welcome to BloqCloud!')
    const { flags } = this.parse(LoginCommand)
    let user = flags.user

    if (user) {
      config.set('user', user)
      consola.info('Saved account id, next time you only needs -p (--password) to login.')
    } else {
      user = config.get('user')
      if (!user) {
        return consola.error('Missing user parameter (-u or --user)')
      }
      consola.info(`Login with user ${user}`)
    }

    const { password } = await inquirer.prompt([
      { name: 'password', message: 'Enter your password', type: 'password' }
    ])
    const Authorization = `Basic ${Buffer.from(`${user}:${password || ''}`).toString('base64')}`
    const url = `${accountsUrl}/auth`
    const spinner = ora().start()

    request.post(url, {
      headers: { Authorization }
    }, function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error trying to get access token: ${err}`)
      }

      const body = JSON.parse(data.body)
      if (data.statusCode !== 200) {
        return consola.error(`Error trying to get access token: ${body.code || body.message}`)
      }

      config.set('accessToken', body.accessToken)
      consola.success('Loggin success, your session expires in 12h.')
    })
  }
}

LoginCommand.description = 'logins you with your bloq-cloud account.'

LoginCommand.flags = {
  user: flags.string({ char: 'u', description: 'account id or email' })
}

module.exports = LoginCommand
