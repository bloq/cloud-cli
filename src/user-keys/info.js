/* eslint-disable no-param-reassign */
'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
const config = require('../config')
const inquirer = require('inquirer')

async function infoUserKey(user, accessToken, { type, keyId }) {
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
    if (!keyId) {
      return consola.error('Missing key id')
    }
  }

  consola.info(`Getting ${type} user keys with id ${keyId} for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/keys/${type}/${keyId}`

  const params = {
    method: 'GET',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    }
  }

  fetch(url, params)
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status !== 201) {
        return consola.error(
          `Error getting user key: ${res.statusText || res.status}.`
        )
      }

      return res.json()
    })
    .then(res => {
      let body = res

      consola.success(`
      * ID:\t\t${keyId}
      * Value:\t\t${body.email || body.address}
      * Verified At:\t${body.veriedAt || '-'}
      * Type:\t\t${type}
      `)

      if (body.keylist) {
        consola.success('\n', body.keylist)
      }
    })
    .catch(err => consola.error(`Error getting user key: ${err}.`))
}

module.exports = infoUserKey
