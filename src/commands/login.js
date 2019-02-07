'use strict'

const Conf = require('conf')
const config = new Conf()

const request = require('request')
const consola = require('consola')
const accountsUrl = 'http://localhost:4000'

const { Command, flags } = require('@oclif/command')

class LoginCommand extends Command {
  async run () {
    const { flags } = this.parse(LoginCommand)
    let user = flags.user

    if (user) {
      config.set('user', user)
      consola.info('Saved user id, next time you only needs -p (--password) to login.')
    } else {
      user = config.get('user')
      if (!user) {
        return consola.error('Missing user parameter (-u or --user)')
      }
    }

    const password = flags.password || ''
    const Authorization = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`

    const url = `${accountsUrl}/auth`
    request.post(url, {
      headers: { Authorization }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to get access token: ${err}`)
      }

      const body = JSON.parse(data.body)

      if (!body.accessToken) {
        return consola.error('Invalid credentials')
      }

      config.set('accessToken', body.accessToken)
      consola.success('Loggin success, your session expires in 12h.')
    })
  }
}

LoginCommand.description = 'logins you with your bloq-cloud account.'

LoginCommand.flags = {
  user: flags.string({ char: 'u', description: 'user id' }),
  password: flags.string({ char: 'p', description: 'password' })
}

module.exports = LoginCommand
