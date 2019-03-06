'use strict'

function isUserValid (user) {
  const USER_REGEX = /user-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  if (USER_REGEX.test(user)) { return true }

  return 'The user id does not have the correct format.'
}

function isUuidValid (uuid) {
  const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  if (UUID_REGEX.test(uuid)) { return true }

  return 'The token does not have the correct format.'
}

module.exports = { isUserValid, isUuidValid }
