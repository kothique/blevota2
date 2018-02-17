import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { toggleMenu } from '../reducers/menu'

import '../styles/header.styl'

class Header extends Component {
  render() {
    const { dispatch } = this.props

    return (
      <header id="h-header">
        <div id="h-container">
          <a onClick={() => dispatch(push('/'))}>
            <div id="h-logo" className="h-box">
              <img src="/images/logo.svg" />
            </div>
            <div id="h-brandname" className="h-box h-box-text">
              Blevota 2
            </div>
          </a>
          <div className="md lg xl">
            <div className="h-box h-box-space"></div>
            <a className="h-box h-box-text"
              onClick={() => dispatch(push('/wiki'))}>
              Wiki
            </a>
          </div>

          <div className="xs sm">
            <a id="h-menu-button" className="h-box h-box-right"
              onClick={() => dispatch(toggleMenu())}>

              <img src="/images/icons/menu-button.svg" />
            </a>
          </div>
          <div className="md lg xl">
            <a className="h-box h-box-text h-box-right"
              onClick={() => dispatch(push('/register'))}>
              Join
            </a>
            <a className="h-nox h-box-text h-box-right"
              onClick={() => dispatch(push('/login'))}>
              Login
             </a>
          </div>
        </div>
      </header>
    )
  }
}

export default connect()(Header)