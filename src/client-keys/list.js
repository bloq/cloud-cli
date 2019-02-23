'use strict'

const consola = require('consola')
const request = require('request')
require('console.table')

const { accountsUrl } = require('../config')

async function createClientKeys (user, accessToken) {
  consola.info(`Getting client keys for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const url = `${accountsUrl}/client-keys`

  request.get(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error trying to list lient keys: ${err}.`)
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error trying to list client keys: ${body.code}.`)
    }

    consola.success(`Got ${body.length} client-keys:`)
    process.stdout.write('\n')
    console.table(body)
  })
}

module.exports = createClientKeys
