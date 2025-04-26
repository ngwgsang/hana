import { render } from '@redwoodjs/testing/web'

import BookmarkPanel from './BookmarkPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BookmarkPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BookmarkPanel />)
    }).not.toThrow()
  })
})
