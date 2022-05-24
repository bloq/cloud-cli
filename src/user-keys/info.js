/* eslint-disable no-param-reassign */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
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

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/keys/${type}/${keyId}`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) return consola.error(`Error getting user key: ${res.status}`)
    let body = res.data

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
}

module.exports = infoUserKey
