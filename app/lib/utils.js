/**
 * Will generate a reference.
 *
 * @param length The reference length.
 * @return {string} The reference.
 */
export function makeRef(length = 12) {
  // prepare characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // assemble utils
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/**
 * Get a formatted string from the provided error.
 *
 * @param err {Error} The error.
 * @return {string|undefined} The string.
 */
export function getError(err) {
  // check err
  if (!err) {
    return undefined;
  }

  // json-api errors
  if (err.errors?.length > 0) {
    return err.errors[0].detail || err.errors[0].title;
  }

  // oauth2 errors
  if (err.responseJSON?.error) {
    return err.responseJSON.error;
  } else if (err.error_description) {
    return err.error_description;
  } else if (err.error) {
    return err.error;
  }

  return err.toString();
}
