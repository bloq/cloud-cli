'use strict'

const consola = require('consola')
const request = require('request')
const config = require('../config')
require('console.table')

async function listClientKeys (user, accessToken, { type }) {
  consola.info(`Getting client keys for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  let url = `${config.get(`services.${env}.accounts.url`)}/keys`

  if (type) { url += `/${type}` }

  request.get(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error listing user keys: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 201) {
      return consola.error(`Error listing user keys: ${body.code || body.message} | ${data.statusCode}.`)
    }

    process.stdout.write('\n')

    for (const keys in body) {
      const keyType = keys.replace('keys', '')
      if (type && type !== keyType) { continue }

      consola.success(`Retrieved ${body[keys].length} ${keyType} user keys:`)
      process.stdout.write('\n')

      body[keys] = body[keys].map((k, id) => {
        const value = k.email || k.address
        return {
          id,
          value,
          verificationToken: k.verificationToken || '-',
          verifiedAt: k.verifiedAt || '-',
          type: keyType.toUpperCase()
        }
      })
      console.table((body[keys]))
    }
  })
}

module.exports = listClientKeys
