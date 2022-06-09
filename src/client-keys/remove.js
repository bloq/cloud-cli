/* eslint-disable consistent-return */
'use strict'

const config = require('../config')
const consola = require('consola')
const { fetcher } = require('../utils')
const inquirer = require('inquirer')

/**
 *  Removes the giving client key
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @param  {Object} flags set of options retrieved by cli
 * @returns {undefined}
 */
async function removeClientKey(user, accessToken, flags) {
  consola.info(`Removing client key for user ${user}.`)
  let { keyId } = flags

  if (!keyId) {
    const prompt = await inquirer.prompt([
      { name: 'keyId', message: 'Enter the client-key id', type: 'text' }
    ])

    keyId = prompt.clientKeyId
    if (!keyId) {
      consola.error('Missing client key id')
      return
    }
  }

  const { confirmation } = await inquirer.prompt([
    {
      name: 'confirmation',
      message: `You will remove client key with id ${keyId}. Do you want to continue?`,
      type: 'confirm',
      default: false
    }
  ])

  if (!confirmation) {
    consola.error('Remove client key was canceled.')
    return
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys/${keyId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok) {
      consola.error(`Error removing the client-key: ${res.message}`)
      return
    }

    if (res.status !== 204) {
      consola.error(
        `Error removing client-key: ${res.status || res.statusText}.`
      )
      return
    }

    consola.success(`Removed client key with id ${keyId}`)
  })
}

module.exports = removeClientKey
