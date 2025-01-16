import type {
  EditMessageById,
  UpdateMessageInput,
  UpdateMessageMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import MessageForm from 'src/components/Message/MessageForm'

export const QUERY: TypedDocumentNode<EditMessageById> = gql`
  query EditMessageById($id: Int!) {
    message: message(id: $id) {
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

const UPDATE_MESSAGE_MUTATION: TypedDocumentNode<
  EditMessageById,
  UpdateMessageMutationVariables
> = gql`
  mutation UpdateMessageMutation($id: Int!, $input: UpdateMessageInput!) {
    updateMessage(id: $id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ message }: CellSuccessProps<EditMessageById>) => {
  const [updateMessage, { loading, error }] = useMutation(
    UPDATE_MESSAGE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Message updated')
        navigate(routes.messages())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateMessageInput,
    id: EditMessageById['message']['id']
  ) => {
    updateMessage({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Message {message?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <MessageForm
          message={message}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
