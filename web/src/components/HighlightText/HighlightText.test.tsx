import { render } from '@redwoodjs/testing/web'

import HighlightText from './HighlightText'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('HighlightText', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HighlightText />)
    }).not.toThrow()
  })
})
