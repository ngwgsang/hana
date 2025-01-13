import { render } from '@redwoodjs/testing/web'

import SideBarLayout from './SideBarLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SideBarLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SideBarLayout />)
    }).not.toThrow()
  })
})
