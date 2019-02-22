'use strict'

const Conf = require('conf')
const config = new Conf()

const http = require('http')
const path = require('path')
const handler = require('serve-handler')
const { parse } = require('querystring')
const { open } = require('openurl')

const request = require('request')
const consola = require('consola')
const { accountsUrl, port, ccUrlBase } = require('../config')

const ccUrl = `${ccUrlBase}:${port}`

const { Command } = require('@oclif/command')

class VerifyCommand extends Command {
  async run () {
    consola.info('Adding your CC information')

    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info(`Getting information for user ${user}`)
    const Authorization = `Bearer ${accessToken}`
    const url = `${accountsUrl}/profile`

    request.get(url, { headers: { Authorization } }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to get user profile: ${err}`)
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('User is not authenticated, use login command to start a new session.')
      }

      const { email } = JSON.parse(data.body)

      const server = http.createServer(function (req, res) {
        if (!(req.method === 'POST' && req.url === '/charge')) {
          return handler(req, res, { public: path.join(__dirname, '../stripe') })
        }

        let body = ''
        req.on('data', chunk => (body += chunk.toString()))
        req.on('end', function () {
          body = parse(body)
          body.email = email

          const url = `${accountsUrl}/stripe`
          request.post(url, { headers: { Authorization }, json: body }, function (err, data) {
            if (err || data.statusCode !== 204) {
              consola.error('Error trying to update your credit card information')
              res.write(`<h1>Error :(</h1><br><code>${err || ''}</code>`)
              return setTimeout(() => process.exit(0), 1000)
            }

            consola.info('Your credit card information was setup')
            res.write('<h1>Done :)</h1>')
            return setTimeout(() => process.exit(1), 1000)
          })
        })
      })

      server.listen(port, function () {
        consola.info(`Open your browser and type the url: ${ccUrl}, to submit your credit card information`) // eslint-disable-line
        open(ccUrl)
      })
    })
  }
}

VerifyCommand.description = 'setup your credit card information'

module.exports = VerifyCommand
