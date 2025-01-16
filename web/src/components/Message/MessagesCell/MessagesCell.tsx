import type { FindMessages, FindMessagesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Messages from 'src/components/Message/Messages'

export const QUERY: TypedDocumentNode<FindMessages, FindMessagesVariables> =
  gql`
    query FindMessages {
      messages {
        id
        sender
        content
        isAct
        timestamp
        createdAt
        updatedAt
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No messages yet.{' '}
      <Link to={routes.newMessage()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindMessages>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  messages,
}: CellSuccessProps<FindMessages, FindMessagesVariables>) => {
  return <Messages messages={messages} />
}
