'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
const { Command, flags } = require('@oclif/command')
const config = require('../config')
require('console.table')

class EventsCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const { flags } = this.parse(EventsCommand)

    if (!user || !accessToken) {
      return consola.error(
        'User is not authenticated. Use login command to start a new session.'
      )
    }

    consola.info(`Retrieving events for user ${user}`)

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users/me/events`
    const spinner = ora().start()

    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }

    fetch(url, params)
      .then(res => {
        spinner.stop()

        if (res.status === 401 || res.status === 403) {
          return consola.error('Your session has expired')
        }

        if (res.status !== 200) {
          return consola.error(
            `Error retrieving events: ${res.statusText || res.status}.`
          )
        }

        return res.json()
      })
      .then(function (res) {
        let events = res.map(({ id, service, serviceData, createdAt }) => ({
          id,
          service,
          serviceData: JSON.stringify(serviceData),
          createdAt
        }))

        if (flags.service) {
          events = events.filter(e =>
            e.service.toLowerCase().includes(flags.service)
          )
        }

        consola.success(`Retrieved ${events.length} events:`)
        process.stdout.write('\n')
        // eslint-disable-next-line no-console
        return console.table(events)
      })
      .catch(err => consola.error(`Error retrieving events: ${err}`))
  }
}

EventsCommand.description = 'Get Bloq daily events'

EventsCommand.flags = {
  service: flags.string({ char: 's', description: 'service name' })
}

module.exports = EventsCommand
