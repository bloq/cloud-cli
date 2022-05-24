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
  let { clientId } = flags

  if (!clientId) {
    const prompt = await inquirer.prompt([
      { name: 'clientId', message: 'Enter the client-key id', type: 'text' }
    ])

    clientId = prompt.clientId
    if (!clientId) {
      return consola.error('Missing client id')
    }
  }

  const { confirmation } = await inquirer.prompt([
    {
      name: 'confirmation',
      message: `You will remove client key with id ${clientId}. Do you want to continue?`,
      type: 'confirm',
      default: false
    }
  ])

  if (!confirmation) {
    return consola.error('Remove client key was canceled.')
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys/${clientId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok) {
      if (res.status !== 204) {
        return consola.error(
          `Error removing client-key: ${res.status || res.statusText}.`
        )
      }
      return consola.error(`Error removing the client-key: ${res.message}`)
    }

    return consola.success(`Removed client key with id ${clientId}`)
  })
}

module.exports = removeClientKey
