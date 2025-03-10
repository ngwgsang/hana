import { render } from '@redwoodjs/testing/web'

import MocktestPage from './MocktestPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MocktestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MocktestPage />)
    }).not.toThrow()
  })
})
