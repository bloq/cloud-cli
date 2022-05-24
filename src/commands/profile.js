'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const { Command } = require('@oclif/command')
const config = require('../config')

class ProfileCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error(
        'User is not authenticated. Use login command to start a new session.'
      )
    }

    consola.info(`Retrieving profile for user ${user}`)
    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users/me`

    return fetcher(url, 'GET', accessToken).then(res => {
      if (!res.ok)
        return consola.error(`Error trying to get user profile: ${res.status}`)
      const { verifiedAt, id, displayName, email } = res.data

      return consola.success(`Retrieved user profile:
      * id:\t\t${id}
      * displayName:\t${displayName}
      * email:\t${email}
      * verified:\t${!!verifiedAt}
    `)
    })
  }
}

ProfileCommand.description = 'Retrieve user profile'

module.exports = ProfileCommand
