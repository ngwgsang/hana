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

import TagList from './TagList'

const meta: Meta<typeof TagList> = {
  component: TagList,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TagList>

export const Primary: Story = {}
