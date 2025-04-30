import { render } from '@redwoodjs/testing/web'

import StatusPanel from './StatusPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('StatusPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StatusPanel />)
    }).not.toThrow()
  })
})
