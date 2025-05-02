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

import HighlightText from './HighlightText'

const meta: Meta<typeof HighlightText> = {
  component: HighlightText,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof HighlightText>

export const Primary: Story = {}
