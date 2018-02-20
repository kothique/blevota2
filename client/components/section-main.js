import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Button from './button'
import '../styles/section-main.styl'

class SectionMain extends Component {
  render() {
    const { dispatch } = this.props

    return (
      <section id="sm-section">
        <img id="sm-logo" src="/images/logo.svg" />
        <h1 id="sm-title">Blevota 2</h1>
        <Button
          id="sm-join-the-battle"
          onClick={() => dispatch(push('/matches'))}>

          <h2 id="sm-small">Join the battle</h2>
        </Button>
      </section>
    )
  }
}

export default connect()(SectionMain)