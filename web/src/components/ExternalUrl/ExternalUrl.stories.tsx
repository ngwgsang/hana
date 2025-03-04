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

import ExternalUrl from './ExternalUrl'

const meta: Meta<typeof ExternalUrl> = {
  component: ExternalUrl,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ExternalUrl>

export const Primary: Story = {}
