/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const { Command, flags } = require('@oclif/command')
const { formatErrorResponse, formatOutput } = require('../utils')
const config = require('../config')

class ProfileCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    const { flags } = this.parse(ProfileCommand)
    const isJson = typeof flags.json !== 'undefined'

    if (!user || !accessToken) {
      formatErrorResponse(
        isJson,
        'User is not authenticated. Use login command to start a new session.'
      )
      return
    }

    !isJson && consola.info(`Retrieving profile for user ${user}`)

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users/me`

    return fetcher(url, 'GET', accessToken).then(res => {
      if (!res.ok) {
        formatErrorResponse(
          isJson,
          `Error trying to get user profile: ${res.status}`
        )
        return
      }

      const data = {
        id: res.data.id,
        displayName: res.data.displayName,
        email: res.data.email,
        verified: res.data.verifiedAt
      }

      !isJson && consola.success(`Retrieved user profile:\n`)
      formatOutput(isJson, data)
    })
  }
}

ProfileCommand.description = 'Retrieve user profile'
ProfileCommand.flags = {
  json: flags.boolean({ char: 'j', description: 'JSON output' })
}

module.exports = ProfileCommand
