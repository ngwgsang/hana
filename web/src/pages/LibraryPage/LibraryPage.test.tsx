import { render } from '@redwoodjs/testing/web'

import LibraryPage from './LibraryPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('LibraryPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LibraryPage />)
    }).not.toThrow()
  })
})
