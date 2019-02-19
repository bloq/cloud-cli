'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')

const { accountsUrl } = require('../config')

class ProfileCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info(`Getting profile for user ${user}`)
    const Authorization = `Bearer ${accessToken}`
    const url = `${accountsUrl}/profile`

    request.get(url, {
      headers: { Authorization }
    }, function (err, res) {
      if (err) {
        return consola.error(`Error trying to get user profile: ${err}`)
      }

      if (res.statusCode === 401 || res.statusCode === 403) {
        return consola.error('User is not authenticated, use login command to start a new session.')
      }

      const { verifiedAt, id, displayName, email, isAdmin } = JSON.parse(res.body)

      consola.success(`Got user profile:
        * id:\t\t${id}
        * role:\t\t${isAdmin ? 'admin' : 'customer'}
        * displayName:\t${displayName}
        * email:\t${email}
        * verified:\t${!!verifiedAt}
      `)
    })
  }
}

ProfileCommand.description = 'gets user profile.'

module.exports = ProfileCommand
