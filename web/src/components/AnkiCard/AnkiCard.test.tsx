import { render } from '@redwoodjs/testing/web'

import AnkiCard from './AnkiCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnkiCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnkiCard />)
    }).not.toThrow()
  })
})
