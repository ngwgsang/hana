import type {
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  FindMessageById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

const DELETE_MESSAGE_MUTATION: TypedDocumentNode<
  DeleteMessageMutation,
  DeleteMessageMutationVariables
> = gql`
  mutation DeleteMessageMutation($id: Int!) {
    deleteMessage(id: $id) {
      id
    }
  }
`

interface Props {
  message: NonNullable<FindMessageById['message']>
}

const Message = ({ message }: Props) => {
  const [deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION, {
    onCompleted: () => {
      toast.success('Message deleted')
      navigate(routes.messages())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteMessageMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete message ' + id + '?')) {
      deleteMessage({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Message {message.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{message.id}</td>
            </tr>
            <tr>
              <th>Sender</th>
              <td>{message.sender}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td>{message.content}</td>
            </tr>
            <tr>
              <th>Is act</th>
              <td>{checkboxInputTag(message.isAct)}</td>
            </tr>
            <tr>
              <th>Timestamp</th>
              <td>{timeTag(message.timestamp)}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(message.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(message.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editMessage({ id: message.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(message.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Message
