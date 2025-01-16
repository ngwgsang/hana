import type {
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  FindMessages,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Message/MessagesCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

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

const MessagesList = ({ messages }: FindMessages) => {
  const [deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION, {
    onCompleted: () => {
      toast.success('Message deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteMessageMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete message ' + id + '?')) {
      deleteMessage({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Sender</th>
            <th>Content</th>
            <th>Is act</th>
            <th>Timestamp</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{truncate(message.id)}</td>
              <td>{truncate(message.sender)}</td>
              <td>{truncate(message.content)}</td>
              <td>{checkboxInputTag(message.isAct)}</td>
              <td>{timeTag(message.timestamp)}</td>
              <td>{timeTag(message.createdAt)}</td>
              <td>{timeTag(message.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.message({ id: message.id })}
                    title={'Show message ' + message.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editMessage({ id: message.id })}
                    title={'Edit message ' + message.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete message ' + message.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(message.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MessagesList
