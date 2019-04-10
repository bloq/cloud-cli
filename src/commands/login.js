'use strict'

const ora = require('ora')
const request = require('request')
const consola = require('consola')
const inquirer = require('inquirer')
const config = require('../config')

const { Command, flags } = require('@oclif/command')

function saveUser (user) {
  config.set('user', user)
  consola.info('Saved account id. Next time you only need -p flag (--password) to login.')
}

class LoginCommand extends Command {
  async run () {
    consola.info('☁️  Welcome to BloqCloud!')
    const { flags } = this.parse(LoginCommand)
    let { user, password } = flags

    if (!user) {
      user = config.get('user')
      if (!user) {
        const prompt = await inquirer.prompt([
          { name: 'user', message: 'Enter your email or account id', type: 'input' }
        ])

        user = prompt.user
        saveUser(user)
      }
    } else {
      saveUser(user)
    }

    consola.info(`Login with user ${user}`)

    if (!password) {
      const prompt = await inquirer.prompt([
        { name: 'password', message: 'Enter your password', type: 'password' }
      ])

      password = prompt.password
    }

    const Authorization = `Basic ${Buffer.from(`${user}:${password || ''}`).toString('base64')}`
    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/auth`
    const spinner = ora().start()

    request.post(url, {
      headers: { Authorization }
    }, function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error retrieving access token: ${err}`)
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('Your credentials are invalid')
      }

      const body = JSON.parse(data.body)
      if (data.statusCode !== 200) {
        return consola.error(`Error retrieving access token: ${body.code || body.message}`)
      }

      config.set('accessToken', body.accessToken)
      consola.success('Login success. Your session expires in 12h.')
    })
  }
}

LoginCommand.description = 'Login to your BloqCloud account'

LoginCommand.flags = {
  user: flags.string({ char: 'u', description: 'account id or email' }),
  password: flags.string({ char: 'p', description: 'password' })
}

module.exports = LoginCommand
