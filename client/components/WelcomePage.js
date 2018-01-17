import React, { Component } from 'react'

class WelcomePage extends Component {
  render() {
    return (
      <main id="welcome-page">
        <h1 style={{ fontSize: '500%', textAlign: 'center' }}>
          Welcome to <span style={{ color: 'red' }}>Blevota 2</span>
        </h1>
      </main>
    )
  }
}

export default WelcomePage