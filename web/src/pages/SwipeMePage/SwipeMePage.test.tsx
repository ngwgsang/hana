import { render } from '@redwoodjs/testing/web'

import SwipeMePage from './SwipeMePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SwipeMePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SwipeMePage />)
    }).not.toThrow()
  })
})
