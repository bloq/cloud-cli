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
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    consola.info(`Retrieving profile for user ${user}`)
    const Authorization = `Bearer ${accessToken}`
    const url = `${accountsUrl}/profile`

    request.get(url, {
      headers: { Authorization }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error retrieving user profile: ${err}`)
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('Your session has expired')
      }

      const body = JSON.parse(data.body)
      if (data.statusCode !== 200) {
        return consola.error(`Error trying to get user profile: ${body.code}`)
      }

      const { verifiedAt, id, displayName, email, isAdmin } = body

      consola.success(`Retrieved user profile:
        * id:\t\t${id}
        * role:\t\t${isAdmin ? 'admin' : 'customer'}
        * displayName:\t${displayName}
        * email:\t${email}
        * verified:\t${!!verifiedAt}
      `)
    })
  }
}

ProfileCommand.description = 'Retrieve user profile'

module.exports = ProfileCommand
