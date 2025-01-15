import { render } from '@redwoodjs/testing/web'

import ToggleButton from './ToggleButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ToggleButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ToggleButton />)
    }).not.toThrow()
  })
})
