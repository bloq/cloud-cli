'use strict'

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const config = require('../config')

/**
 *  Removes the giving client key
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @param  {object} flags set of options retrieved by cli
 * @returns {undefined}
 */
async function removeClientKey (user, accessToken, flags) {
  consola.info(`Removing client key for user ${user}.`)
  let { clientId } = flags

  if (!clientId) {
    const prompt = await inquirer.prompt([
      { name: 'clientId', message: 'Enter the client-key id', type: 'text' }
    ])

    clientId = prompt.clientId
    if (!clientId) { return consola.error('Missing client id') }
  }

  const { confirmation } = await inquirer.prompt([{
    name: 'confirmation',
    message: `You will remove client key with id ${clientId}. Do you want to continue?`,
    type: 'confirm',
    default: false
  }])

  if (!confirmation) {
    return consola.error('Remove client key was canceled.')
  }

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.accounts.url`)}/users/me/client-keys/${clientId}`

  request.del(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error removing the client-key: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 204) {
      const body = JSON.parse(data.body)
      return consola.error(`Error removing client-key: ${body.code}.`)
    }

    consola.success(`Removed client key with id ${clientId}`)
  })
}

module.exports = removeClientKey
