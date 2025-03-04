import { render } from '@redwoodjs/testing/web'

import ExternalUrl from './ExternalUrl'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ExternalUrl', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExternalUrl />)
    }).not.toThrow()
  })
})
