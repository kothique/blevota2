/**
 * @module client/local-storage
 */

/**
 * @return {object}
*/
export const loadState = () => {
  const serializedState = localStorage.getItem('redux-state')
  if (!serializedState) {
    return undefined
  }

  try {
    return JSON.parse(serializedState)
  } catch (err) {
    console.log('Error while parsing redux state from localStorage:', err.stack)
    return undefined
  }
}

/**
 * @param {object} state
 */
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('redux-state', serializedState)
  } catch (err) {
    console.log('Error while trying to serialize redux state:', err.stack)
  }
}