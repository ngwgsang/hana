// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/7/writing-stories/args

import type { Meta, StoryObj } from '@storybook/react'

import AnkiCardCrudPopup from './AnkiCardCrudPopup'

const meta: Meta<typeof AnkiCardCrudPopup> = {
  component: AnkiCardCrudPopup,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AnkiCardCrudPopup>

export const Primary: Story = {}
