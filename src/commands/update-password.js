/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const config = require('../config')
const { isPasswordValid, arePasswordEquals } = require('../validator')
class UpdatePasswordCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      consola.error(
        'User is not authenticated. Use login command to start a new session.'
      )
      return
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
      consola.error('New password must be different from old password')
      return
    }

    consola.info(`Updating password for user ${user}`)
    const env = config.get('env') || 'prod'
    const url = `${config.get(
      `services.${env}.accounts.url`
    )}/users/me/password`
    const json = { newPassword, oldPassword }
    const body = JSON.stringify(json)

    return fetcher(url, 'PUT', accessToken, body).then(res => {
      if (!res.ok) {
        consola.error(`Error updating user password: ${res.status}`)
        return
      }

      consola.success('User password updated')
    })
  }
}

UpdatePasswordCommand.description = 'Update user password'

module.exports = UpdatePasswordCommand
