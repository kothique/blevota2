module.exports = {
  /**
   * The secret used for JWT authentication.
   */
  authSecret: 'the-most-secret-secret',

  inspector: {
    /**
     * The inspector port of the parent process. Child processes
     * will get subsequent ports with the step of 1.
     */
    port: 9300
  }
}