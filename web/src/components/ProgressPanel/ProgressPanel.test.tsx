import { render } from '@redwoodjs/testing/web'

import ProgressPanel from './ProgressPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProgressPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProgressPanel />)
    }).not.toThrow()
  })
})
