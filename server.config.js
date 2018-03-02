module.exports = {
  /**
   * Authentication configuration.
   */
  auth: {
    secret: 'the-most-secret-secret',
  },

  /**
   * Server configuration.
   */
  server: {
    port: 3000
  },

  /**
   * Database configuration.
   */
  db: {
    host: 'localhost',
    port: 27017,
    username: undefined,
    password: undefined
  }
}