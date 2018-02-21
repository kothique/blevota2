import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { func, string } from 'prop-types'
import { push } from 'react-router-redux'
import { decode } from 'jsonwebtoken'

import Game from '../game'
import Header from './header'
import MobileMenu from './mobile-menu'
import Footer from './footer'
import Access from './access'

import '../styles/game-page.styl'

/**
 * @class
 */
class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
  }

  initialize() {
    const { dispatch, match, token, user } = this.props
    const { params: { matchId } } = match,
          context = document.getElementById('gp-game'),
          info = document.getElementById('gp-info'),
          host = 'http://localhost:3000'

    const game = this.game = new Game({
      host,
      context,
      info,
      token,
      user,
      matchId
    })

    game.on('connect', () => {
      console.log(`Successfully connected to ${host}`)
    })

    game.on('connect_error', (err) => {
      console.log(err.stack)
      dispatch(push('/'))
    })

    game.on('error', (err) => {
      console.log(err.stack)
      dispatch(push('/'))
    })

    game.on('disconnect', () => {
      console.log(`Disconnected from ${host}`)
      dispatch(push('/'))
    })
  }

  deinitialize() {
    if (this.game) {
      this.game.stop()
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch, isFetching, user, token, match } = this.props

    if (user && !prevProps.user) {
      this.initialize()
    } else if (!user && prevProps.user) {
      this.deinitialize()
    }
  }

  componentWillUnmount() {
    this.deinitialize()
  }

  render() {
    return (
      <Fragment>
        <Header />
        <MobileMenu />
        <div id="content">
          <Access users>
              <svg
                id="gp-game"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                >
              </svg>

              <div id="gp-info"></div>
          </Access>
        </div>
        <Footer />
    </Fragment>
    )
  }
}

export default connect(
  ({ login }) => ({
    user: login.user,
    token: login.token
  })
)(GamePage)
