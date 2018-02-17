import React, { Component } from 'react'

import '../styles/main-section.styl'

class MainSection extends Component {
  render() {
    return (
      <section id="ms-section">
        <img id="ms-logo" src="/images/logo.svg" />
        <h1 id="ms-title">Blevota 2</h1>
        <h2 id="ms-small">Join the battle</h2>
      </section>
    )
  }
}

export default MainSection