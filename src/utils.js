'use strict'

const consola = require('consola')
const clipboardy = require('clipboardy')

/**
 * Helper to copy strings to the user's clipboard.
 *
 * @param {string} value What to copy to the clipboard.
 * @param {string} name The name of what is being copied.
 */
const coppyToClipboard = (value, name) =>
  clipboardy
    .write(value)
    .then(() => consola.info(`${name} was copied to the clipboard.`))
    .catch(err => {
      consola.error(`Could not copy ${name} to the clipboard: ${err}`)
    })

module.exports = {
  coppyToClipboard
}
