import { render } from '@redwoodjs/testing/web'

import NavigationPanel from './NavigationPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NavigationPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NavigationPanel />)
    }).not.toThrow()
  })
})
