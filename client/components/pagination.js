import React, { Component } from 'react'
import { string, number, func, object } from 'prop-types'

import Button from './button'
import ButtonGroup from './button-group'

import '@client/styles/pagination.styl'

class Pagination extends Component {
  static propTypes = {
    id: string,
    className: string,
    start: number.isRequired,
    end: number.isRequired,
    page: number,
    maxPages: number,
    onChange: func,
    attrs: object
  }

  static defaultProps = {
    className: '',
    page: 1,
    maxPages: 4
  }

  constructor(props) {
    super(props)

    const { page } = props

    this.state = {
      page
    }
  }

  setPage(page) {
    const { onChange } = this.props

    this.setState({ page })
    onChange && window.setImmediate(() => onChange(page))
  }

  getButtons() {
    const { start, end, maxPages } = this.props,
          { page } = this.state
    let buttons = []

    const maxLeft = page - start,
          maxRight = end - page
    let left = Math.floor((maxPages - 1) / 2),
        right = Math.ceil((maxPages - 1) / 2)

    if (maxLeft + maxRight < maxPages) {
      for (let i = start; i <= end; i++) {
        buttons.push(i)
      }
    } else if (maxLeft <= left) {
      right = maxPages - maxLeft - 1

      for (let i = start; i <= page + (right - 1); i++) {
        buttons.push(i)
      }

      buttons.push(-2)
      buttons.push(end)
    } else if (maxRight <= right) {
      buttons.push(start)
      buttons.push(-1)

      left = maxPages - maxRight - 1

      for (let i = page - (left - 1); i <= end; i++) {
        buttons.push(i)
      }
    } else {
      buttons.push(start)
      buttons.push(-1)

      for (let i = page - (left - 1); i <= page + (right - 1); i++) {
        buttons.push(i)
      }

      buttons.push(-2)
      buttons.push(end)
    }

    return buttons
  }

  render() {
    const { id, className, start, end, maxPages, attrs } = this.props,
          { page } = this.state

    const buttons = this.getButtons()

    return (
      <div
        id={id}
        className={`pagination ${className}`}
        {...attrs}>

        <ButtonGroup>
          <Button
            attrs={{ disabled: page === start }}
            onClick={() => this.setPage(page - 1)}>
            &lt;
          </Button>

          {buttons.map((n) =>
            <Button
              id={n === page ? 'p-active' : ''}
              key={n}
              onClick={() => this.setPage(n)}
              attrs={{ disabled: n < 0 }}>

              {n > 0 ? n : '...'}
            </Button>
          )}

          <Button
            attrs={{ disabled: page === end }}
            onClick={() => this.setPage(page + 1)}>
            &gt;
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default Pagination