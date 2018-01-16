import { createStore } from 'redux'

// @flow
type State = {
  greeting: string
}

type Action = mixed

export default createStore((state: State, action: Action) => {
  switch (action.type) {
  default:
    return state
  }
}, {
  greeting: 'Hi there!'
})
