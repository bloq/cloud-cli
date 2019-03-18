'use strict'

const consola = require('consola')
const request = require('request')
const config = require('../config')
require('console.table')

async function listClientKeys (user, accessToken) {
  consola.info(`Getting client keys for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const url = `${config.get('services.accounts.url')}/client-keys`

  request.get(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error listing client keys: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error listing client keys: ${body.code || body.message} | ${data.statusCode}.`)
    }

    consola.success(`Retrieved ${body.length} client keys:`)
    process.stdout.write('\n')
    console.table(body)
  })
}

module.exports = listClientKeys
