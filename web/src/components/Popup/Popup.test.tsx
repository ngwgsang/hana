import { render } from '@redwoodjs/testing/web'

import Popup from './Popup'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Popup', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Popup />)
    }).not.toThrow()
  })
})
