'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const config = require('../config')
const { isPasswordValid, arePasswordEquals } = require('../validator')
class UpdatePasswordCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error(
        'User is not authenticated. Use login command to start a new session.'
      )
    }

    const { oldPassword, newPassword } = await inquirer.prompt([
      { name: 'oldPassword', message: 'Enter old password', type: 'password' },
      {
        name: 'newPassword',
        message: 'Enter new password',
        type: 'password',
        validate: isPasswordValid
      }
    ])

    await inquirer.prompt([
      {
        name: 'confirmPassword',
        message: 'Confirm new password',
        type: 'password',
        validate: value => arePasswordEquals(value, newPassword)
      }
    ])

    if (oldPassword === newPassword) {
      return consola.error('New password must be different from old password')
    }

    consola.info(`Updating password for user ${user}`)
    const env = config.get('env') || 'prod'
    const url = `${config.get(
      `services.${env}.accounts.url`
    )}/users/me/password`
    const json = { newPassword, oldPassword }

    const params = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(json)
    }

    fetch(url, params)
      .then(res => {
        if (res.status === 400) {
          return consola.error(
            `Error updating user password: ${res.statusText}`
          )
        }

        if (res.status !== 204) {
          return consola.error('Error updating user password.')
        }

        return consola.success('User password updated')
      })
      .catch(err => consola.error(`Error updating user password: ${err}`))
  }
}

UpdatePasswordCommand.description = 'Update user password'

module.exports = UpdatePasswordCommand
