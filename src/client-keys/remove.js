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
      consola.error('Missing client id')
      return
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
    consola.error('Remove client key was canceled.')
    return
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys/${clientId}`

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

    consola.success(`Removed client key with id ${clientId}`)
  })
}

module.exports = removeClientKey
