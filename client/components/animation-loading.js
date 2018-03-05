import React, { Component } from 'react'

import '@client/styles/animation-loading.styl'

class AnimationLoading extends Component {
  render() {
    return (
      <div className="animation-loading">
        <img src="/images/icons/loading.svg" />
      </div>
    )
  }
}

export default AnimationLoading