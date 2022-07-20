'use strict'

const config = require('../config')
const consola = require('consola')
const { fetcher, formatResponse, formatErrorResponse } = require('../utils')
const inquirer = require('inquirer')

/**
 *  Removes the giving client key
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @param  {Object} flags set of options retrieved by cli
 * @returns {undefined}
 */
async function removeClientKey({ user, accessToken, json, ...flags }) {
  const isJson = typeof json !== 'undefined'

  let keyId = flags.keyId

  if (!isJson) {
    consola.info(`Removing client key for user ${user}.`)

    const prompt = await inquirer.prompt([
      {
        name: 'keyId',
        message: 'Enter the client-key id',
        type: 'text',
        when: () => !flags.keyId
      },
      {
        name: 'yes',
        message: `You will remove client key. Do you want to continue?`,
        type: 'confirm',
        default: false,
        when: () => !flags.yes
      }
    ])

    const { yes } = {
      ...flags,
      ...prompt
    }

    if (!yes) {
      formatResponse(isJson, 'No action taken')
      return
    }
  }

  if (!keyId) {
    formatErrorResponse(isJson, 'Missing client key id')
    return
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys/${keyId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error removing the client-key: ${res.message}`
      )
      return
    }

    if (res.status !== 204) {
      formatErrorResponse(
        isJson,
        `Error removing client-key: ${res.status || res.statusText}.`
      )
      return
    }

    formatResponse(isJson, `Removed client key with id ${keyId}`)
  })
}

module.exports = removeClientKey
