import { render } from '@redwoodjs/testing/web'

import TagList from './TagList'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('TagList', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TagList />)
    }).not.toThrow()
  })
})
