/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
'use strict'
const ora = require('ora')
const fetch = require('node-fetch').default
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
        consola.error('Missing password')
        return
      }
    }

    const Authorization = `Basic ${Buffer.from(
      `${user}:${password || ''}`
    ).toString('base64')}`
    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/auth`
    const spinner = ora().start()

    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization
      }
    }

    return fetch(url, params)
      .then(res => {
        spinner.stop()
        if (res.status === 401 || res.status === 403) {
          return {
            ok: false,
            status: res.status,
            message: 'The username or password you entered is incorrect'
          }
        }

        if (res.status !== 200) {
          return {
            ok: false,
            status: res.status,
            message: `Error retrieving access token: ${
              res.statusText || res.status
            }`
          }
        }
        return res.json().then(res => ({
          ok: true,
          status: 200,
          accessToken: res.accessToken
        }))
      })
      .then(res => {
        if (!res.ok) {
          consola.error(`${res.message} (${res.status})`)
          return res
        }
        config.set('accessToken', res.accessToken)
        consola.success('Login success. Your session expires in 12h.')
      })
  }
}

LoginCommand.description = 'Login to your Bloq account'

LoginCommand.flags = {
  user: flags.string({ char: 'u', description: 'email address or account id' }),
  password: flags.string({ char: 'p', description: 'password' })
}

module.exports = LoginCommand
