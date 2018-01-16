import React from 'react'
import { connect } from 'react-redux'

// @flow
type Props = {
  greeting: string
}

class App extends React.Component<Props> {
  render = () => {
    const { greeting } = this.props

    return <h3>{greeting}</h3>
  }
}

export default connect(
  state => ({
    greeting: state.greeting
  })
)(App)