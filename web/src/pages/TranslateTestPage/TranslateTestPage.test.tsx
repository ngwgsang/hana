import { render } from '@redwoodjs/testing/web'

import TranslateTestPage from './TranslateTestPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TranslateTestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TranslateTestPage />)
    }).not.toThrow()
  })
})
