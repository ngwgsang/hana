import { render } from '@redwoodjs/testing/web'

import ReportPage from './ReportPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ReportPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ReportPage />)
    }).not.toThrow()
  })
})
