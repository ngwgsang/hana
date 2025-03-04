import { render } from '@redwoodjs/testing/web'

import LoadingAnimation from './LoadingAnimation'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('LoadingAnimation', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LoadingAnimation />)
    }).not.toThrow()
  })
})
