'use strict'

const consola = require('consola')
const request = require('request')
const config = require('../config')

async function infoUserKey (user, accessToken, { type, keyId }) {
  if (!type) {
    const prompt = await inquirer.prompt([
      { name: 'type', message: 'Enter the key type', type: 'text' }
    ])

    type = prompt.type
  }

  if (!keyId) {
    const prompt = await inquirer.prompt([
      { name: 'keyId', message: 'Enter the key id', type: 'text' }
    ])

    keyId = prompt.keyId
    if (!keyId) { return consola.error('Missing key id') }
  }

  consola.info(`Getting ${type} user keys with id ${keyId} for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.accounts.url`)}/users/me/keys/${type}/${keyId}`

  request.get(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error getting user key: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 201) {
      return consola.error(`Error getting user key: ${body.code || body.message} | ${data.statusCode}.`)
    }

    consola.success(`
    * ID:\t\t${keyId}
    * Value:\t\t${body.email || body.address}
    * Verified At:\t${body.veriedAt || '-'}
    * Type:\t\t${type}
    `)

    if (body.keylist) { console.log('\n', body.keylist) }
  })
}

module.exports = infoUserKey
