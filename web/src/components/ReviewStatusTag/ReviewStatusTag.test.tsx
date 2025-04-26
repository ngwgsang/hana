import { render } from '@redwoodjs/testing/web'

import ReviewStatusTag from './ReviewStatusTag'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ReviewStatusTag', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ReviewStatusTag />)
    }).not.toThrow()
  })
})
