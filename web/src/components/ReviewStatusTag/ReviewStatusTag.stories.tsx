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

import ReviewStatusTag from './ReviewStatusTag'

const meta: Meta<typeof ReviewStatusTag> = {
  component: ReviewStatusTag,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ReviewStatusTag>

export const Primary: Story = {}
