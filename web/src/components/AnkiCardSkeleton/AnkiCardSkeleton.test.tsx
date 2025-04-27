import { render } from '@redwoodjs/testing/web'

import AnkiCardSkeleton from './AnkiCardSkeleton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnkiCardSkeleton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnkiCardSkeleton />)
    }).not.toThrow()
  })
})
