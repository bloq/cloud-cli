'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
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

    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }

    fetch(url, params)
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          return consola.error('Your session has expired')
        }

        if (res.status !== 200) {
          return consola.error(
            `Error trying to get user profile: ${res.statusText || res.status}.`
          )
        }

        return res.json()
      })
      .then(res => {
        const { verifiedAt, id, displayName, email } = res

        consola.success(`Retrieved user profile:
      * id:\t\t${id}
      * displayName:\t${displayName}
      * email:\t${email}
      * verified:\t${!!verifiedAt}
    `)
      })
      .catch(err => consola.error(`Error retrieving user profile: ${err}`))
  }
}

ProfileCommand.description = 'Retrieve user profile'

module.exports = ProfileCommand
