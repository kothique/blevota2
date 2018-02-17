import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import '../styles/menu.styl'

class Menu extends Component {
  render() {
    const { hidden, dispatch } = this.props

    return (
      <nav id="m-menu" className={'xs sm' + (hidden ? ' hidden' : '')}>
        <a id="m-item-wiki" className="m-item"
          onClick={() => dispatch(push('/wiki'))}>
          <img src="/images/icons/open-book.svg" />
        </a>
        <a id="m-item-login" className="m-item"
          onClick={() => dispatch(push('/login'))}>
          <img src="/images/icons/open-book.svg" />
        </a>
        <a id="m-item-join" className="m-item"
          onClick={() => dispatch(push('/register'))}>
          <img src="/images/icons/open-book.svg" />
        </a>
      </nav>
    )
  }
}

export default connect(
  (state) => ({
    hidden: state.menu.hidden
  })
)(Menu)