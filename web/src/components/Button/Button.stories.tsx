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
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Button>

export function Primary() {
  return <Button className="bg-blue-600">Primary Button</Button>
}

export function Danger() {
  return <Button className="bg-red-600">Danger Button</Button>
}

