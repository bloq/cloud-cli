/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
'use strict'
const fetch = require('node-fetch').default
const { formatResponse, formatErrorResponse } = require('../utils')

const consola = require('consola')
const inquirer = require('inquirer')
const config = require('../config')

const { Command, flags } = require('@oclif/command')

function saveUser(user, isJson) {
  config.set('user', user)
  !isJson &&
    consola.info(
      'Account saved. Next time you only need -p flag (--password) to login.'
    )
}

class LoginCommand extends Command {
  async run() {
    const { flags } = this.parse(LoginCommand)
    let { user, password } = flags
    const isJson = typeof flags.json !== 'undefined'
    !isJson && consola.info('☁️  Welcome to Bloq!')

    if (user) {
      saveUser(user, isJson)
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
        saveUser(user, isJson)
      }
    }

    !isJson && consola.info(`Login with user ${user}`)

    if (!password) {
      const prompt = await inquirer.prompt([
        { name: 'password', message: 'Enter your password', type: 'password' }
      ])

      password = prompt.password
      if (!password) {
        formatErrorResponse.error(isJson, 'Missing password')
        return
      }
    }

    const Authorization = `Basic ${Buffer.from(
      `${user}:${password || ''}`
    ).toString('base64')}`
    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/auth`
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization
      }
    }

    return fetch(url, params)
      .then(res => {
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
          formatErrorResponse(isJson, `${res.message} (${res.status})`)
          return
        }
        config.set('accessToken', res.accessToken)
        formatResponse(isJson, 'Login success. Your session expires in 12h.')
      })
  }
}

LoginCommand.description = 'Login to your Bloq account'
LoginCommand.flags = {
  user: flags.string({ char: 'u', description: 'email address or account id' }),
  password: flags.string({ char: 'p', description: 'password' }),
  json: flags.boolean({ char: 'j', description: 'JSON output' })
}

module.exports = LoginCommand
