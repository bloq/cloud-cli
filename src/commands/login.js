'use strict'
const ora = require('ora')
const request = require('request')
const consola = require('consola')
const inquirer = require('inquirer')
const config = require('../config')

const { Command, flags } = require('@oclif/command')

function saveUser(user) {
  config.set('user', user)
  consola.info(
    'Account saved. Next time you only need -p flag (--password) to login.'
  )
}

class LoginCommand extends Command {
  async run() {
    consola.info('☁️  Welcome to Bloq!')
    const { flags } = this.parse(LoginCommand)
    let { user, password } = flags

    if (user) {
      saveUser(user)
    } else {
      user = config.get('user')
      if (!user) {
        const prompt = await inquirer.prompt([
          {
            name: 'user',
            message: 'Enter your email address or account id',
            type: 'input'
          }
        ])

        user = prompt.user
        saveUser(user)
      }
    }

    consola.info(`Login with user ${user}`)

    if (!password) {
      const prompt = await inquirer.prompt([
        { name: 'password', message: 'Enter your password', type: 'password' }
      ])

      password = prompt.password
      if (!password) {
        return consola.error('Missing password')
      }
    }

    const Authorization = `Basic ${Buffer.from(
      `${user}:${password || ''}`
    ).toString('base64')}`
    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/auth`
    const spinner = ora().start()

    request.post(
      url,
      {
        headers: { Authorization },
        json: true
      },
      function (err, data) {
        spinner.stop()
        if (err) {
          return consola.error(`Error retrieving access token: ${err}`)
        }

        const { statusCode, body } = data

        if (statusCode === 401 || statusCode === 403) {
          return consola.error(
            'The username or password you entered is incorrect'
          )
        }

        if (statusCode !== 200) {
          return consola.error(
            `Error retrieving access token: ${body.code || body.message}`
          )
        }

        config.set('accessToken', body.accessToken)
        consola.success('Login success. Your session expires in 12h.')
      }
    )
  }
}

LoginCommand.description = 'Login to your Bloq account'

LoginCommand.flags = {
  user: flags.string({ char: 'u', description: 'email address or account id' }),
  password: flags.string({ char: 'p', description: 'password' })
}

module.exports = LoginCommand
