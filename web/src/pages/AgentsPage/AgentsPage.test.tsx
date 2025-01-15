import { render } from '@redwoodjs/testing/web'

import AgentsPage from './AgentsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AgentsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AgentsPage />)
    }).not.toThrow()
  })
})
