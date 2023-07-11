'use strict'

const consola = require('consola')
const clipboardy = require('clipboardy')
const fetch = require('node-fetch').default
const ora = require('ora')

/**
 * Helper to copy strings to the user's clipboard.
 *
 * @param {string} value What to copy to the clipboard.
 * @param {string} name The name of what is being copied.
 */
const copyToClipboard = (value, name) =>
  clipboardy
    .write(value)
    .then(() => consola.info(`${name} was copied to the clipboard.`))
    .catch(err =>
      err.stderr && err.stderr.includes('xsel')
        ? null
        : consola.error(`Could not copy ${name} to the clipboard: ${err}`)
    )

const fetcher = (url, method, accessToken, body) => {
  const headers = accessToken
    ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    : {
        'Content-Type': 'application/json'
      }

  const params = {
    method,
    headers,
    body
  }
  const spinner = ora().start()

  return fetch(url, params).then(function (res) {
    spinner.stop()
    // prefilters common errors
    if (res.status === 401)
      return { ok: false, status: res.status, message: 'Unauthorized' }

    if (res.status === 403)
      return {
        ok: false,
        status: res.status,
        message: 'Your session has expired'
      }

    if (res.status === 404)
      return {
        ok: false,
        status: res.status,
        message: 'Error retrieving information, requested resource not found'
      }

    if (res.status === 204) return { ok: true, status: res.status }

    // custom error messages
    if (res.status !== 200 && res.status !== 201)
      return {
        ok: false,
        status: res.status,
        message: `${res.statusText} (${res.status})`
      }

    return res.json().then(data => {
      return { ok: true, status: res.status, data }
    })
  })
}

const returnResponse = (isJson, ok, message) => {
  isJson
    ? console.log(JSON.stringify({ ok, message }, null, 2))
    : ok
    ? consola.info(message)
    : consola.error(message)
}

const formatResponse = (isJson, message) =>
  returnResponse(isJson, true, message)

const formatErrorResponse = (isJson, message) =>
  returnResponse(isJson, false, message)

const formatCredentials = authObj => {
  let res = { auth: authObj.type }
  if (authObj.type === 'basic') {
    res = { auth: authObj.type, user: authObj.user, password: authObj.pass }
  }

  return res
}

const capitalize = str =>
  `${str[0].toUpperCase()}${str.slice(1)}:`.padEnd(24, ' ')

const formatOutput = (isJson, dataObj) => {
  if (!isJson) {
    if (!Array.isArray(dataObj)) {
      for (const key in dataObj) {
        console.log(`* ${capitalize(key)}${dataObj[key] ?? ''}`)
      }
    } else {
      console.table(dataObj)
    }
  } else {
    console.log(JSON.stringify(dataObj, null, 2))
  }
}

module.exports = {
  copyToClipboard,
  fetcher,
  formatCredentials,
  formatOutput,
  formatResponse,
  formatErrorResponse
}
