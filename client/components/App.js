import React, { Component } from 'react'
import { connect } from 'react-redux'

// @flow
type Props = {
  greeting: string,
  params: {
    word?: string
  }
}

class App extends Component<Props> {
  render() {
    const { greeting } = this.props

    return <h3>{greeting}</h3>
  }
}

export default connect(
  state => ({
    greeting: state.app.greeting
  })
)(App)