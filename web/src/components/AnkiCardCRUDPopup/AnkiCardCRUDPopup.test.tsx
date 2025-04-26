import { render } from '@redwoodjs/testing/web'

import AnkiCardCrudPopup from './AnkiCardCrudPopup'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnkiCardCrudPopup', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnkiCardCrudPopup />)
    }).not.toThrow()
  })
})
