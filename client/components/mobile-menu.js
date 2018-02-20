import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import '../styles/mobile-menu.styl'

class MobileMenu extends Component {
  render() {
    const { hidden, dispatch } = this.props

    return (
      <nav id="mm-menu" className={'xs sm' + (hidden ? ' hidden' : '')}>
        <a id="mm-item-wiki" className="mm-item"
          onClick={() => dispatch(push('/wiki'))}>
          <img src="/images/icons/open-book.svg" />
        </a>
        <a id="mm-item-login" className="mm-item"
          onClick={() => dispatch(push('/login'))}>
          <img src="/images/icons/open-book.svg" />
        </a>
        <a id="mm-item-join" className="mm-item"
          onClick={() => dispatch(push('/register'))}>
          <img src="/images/icons/open-book.svg" />
        </a>
      </nav>
    )
  }
}

export default connect(
  (state) => ({
    hidden: state.mobileMenu.hidden
  })
)(MobileMenu)