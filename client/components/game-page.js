import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { func, string } from 'prop-types'
import { push } from 'react-router-redux'
import { decode } from 'jsonwebtoken'

import Game from '../game'
import Header from './header'
import MobileMenu from './mobile-menu'
import Footer from './footer'
import SkillIcon from './skill-icon'
import Access from './access'

import SkillState from '../../common/skill-state'

import '../styles/game-page.styl'

/**
 * @class
 */
class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      skillA1: {
        type: SkillState.READY
      },
      skillA2: {
        type: SkillState.READY
      }
    }
  }

  initialize() {
    const { dispatch, match, token, user } = this.props
    const { params: { regionName } } = match,
          context = document.getElementById('gp-game'),
          info = document.getElementById('gp-info'),
          log = document.getElementById('gp-log'),
          host = 'http://localhost:3000'

    const game = this.game = new Game({
      host,
      context,
      info,
      log,
      token,
      user,
      regionName
    })

    game.on('skills', (skills) => {
      this.setState({
        skillA1: skills.skillA1,
        skillA2: skills.skillA2
      })
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

  componentDidMount() {
    const { user } = this.props

    if (user) {
      this.initialize()
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props

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
    const { skillA1, skillA2 } = this.state

    return (
      <Fragment>
        <Header />
        <MobileMenu />
        <div id="content">
          <Access users>
            <SkillIcon id="gp-skill-a1" state={skillA1} />
            <SkillIcon id="gp-skill-a2" state={skillA2} />
            <svg
              id="gp-game"
              version="1.1"
              baseProfile="full"
              xmlns="http://www.w3.org/2000/svg"
              >
            </svg>

            <div id="gp-info"></div>
            <div id="gp-log"></div>
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
