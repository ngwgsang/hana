import { render } from '@redwoodjs/testing/web'

import PingDot from './PingDot'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PingDot', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PingDot />)
    }).not.toThrow()
  })
})
