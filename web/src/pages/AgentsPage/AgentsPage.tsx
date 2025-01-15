import { Metadata, useQuery, useMutation, gql, useLazyQuery } from '@redwoodjs/web'
import { useState, useEffect } from 'react'
import Header from 'src/components/Header/Header'
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/solid'
import MainLayout from 'src/layouts/MainLayout/MainLayout'
import Popup from 'src/components/Popup'

// GraphQL Query to fetch agents
const GET_AGENTS = gql`
  query GetAgents {
    agents {
      id
      name
      avatar
      settings
    }
  }
`

const GET_AGENT = gql`
  query GetAgent($id: Int!) {
    agent(id: $id) {
      id
      name
      avatar
      settings
      team {
        id
        name
      }
    }
  }
`

// Thêm Mutation để tạo Agent
const CREATE_AGENT = gql`
  mutation CreateAgent($input: CreateAgentInput!) {
    createAgent(input: $input) {
      id
      name
      avatar
      settings
    }
  }
`

// Thêm Mutation để cập nhật Agent
const UPDATE_AGENT = gql`
  mutation UpdateAgent($id: Int!, $input: UpdateAgentInput!) {
    updateAgent(id: $id, input: $input) {
      id
      name
      avatar
      settings
    }
  }
`

// GraphQL Mutation to delete an agent
const DELETE_AGENT = gql`
  mutation DeleteAgent($id: Int!) {
    deleteAgent(id: $id) {
      id
    }
  }
`

const AgentsPage = () => {

  const { data, loading, error, refetch } = useQuery(GET_AGENTS)

  const [deleteAgent] = useMutation(DELETE_AGENT, {
    onCompleted: () => refetch(),
  })
  const [createAgent] = useMutation(CREATE_AGENT, {
    onCompleted: () => refetch(),
  })

  const [updateAgent] = useMutation(UPDATE_AGENT, {
    onCompleted: () => refetch(),
  })

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupTitle, setPopupTitle] = useState('')
  const [popupContent, setPopupContent] = useState<React.ReactNode>(null)
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    settings: '',
  })

  // Mở Popup
  const handleOpenPopup = (title: string, content: React.ReactNode) => {
    setPopupTitle(title)
    setPopupContent(content)
    setIsPopupOpen(true)
  }

  // Đóng Popup
  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  // Xử lý xóa Agent
  const handleDelete = (id) => {
    handleOpenPopup(
      'Xác nhận xóa',
      <>
        <p>Bạn có chắc chắn muốn xóa agent này?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleClosePopup}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              deleteAgent({ variables: { id } })
              handleClosePopup()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Xóa
          </button>
        </div>
      </>
    )
  }

  // Xử lý thêm mới Agent
  const handleAddAgent = () => {
    setFormData({ name: '', avatar: '', settings: '' }) // Reset form
    setIsEditing(false)  // Phân biệt giữa thêm và sửa
    setIsPopupOpen(true)
  }

  // Xử lý cập nhật Agent
  const handleEditAgent = (agentId) => {
    setSelectedAgentId(agentId)
    setIsEditing(true)
    setIsPopupOpen(true)

    const agent = data.agents.find((a) => a.id === agentId)
    if (agent) {
      setFormData({
        name: agent.name,
        avatar: agent.avatar,
        settings: agent.settings,
      })
    }
  }


  if (loading) return <p>Đang tải...</p>
  if (error) return <p>Có lỗi xảy ra: {error.message}</p>

  const renderAgentForm = () => {
    const handleSubmit = (e) => {
      e.preventDefault()
      if (isEditing) {
        updateAgent({
          variables: {
            id: selectedAgentId,
            input: {
              name: formData.name,
              avatar: formData.avatar,
              settings: formData.settings,
              teamId: 1,  // Giả sử teamId là 1
            },
          },
        })
      } else {
        createAgent({
          variables: {
            input: {
              name: formData.name,
              avatar: formData.avatar,
              settings: formData.settings,
              teamId: 1,  // Giả sử teamId là 1
            },
          },
        })
      }
      handleClosePopup()
      setSelectedAgentId(null)
    }

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Tên Agent"
          className="w-full p-2 border mb-2 rounded"
          required
        />
        <input
          type="text"
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          placeholder="Link Avatar"
          className="w-full p-2 border mb-2 rounded"
          required
        />
        <input
          type="text"
          value={formData.settings}
          onChange={(e) => setFormData({ ...formData, settings: e.target.value })}
          placeholder="Cài đặt (JSON)"
          className="w-full p-2 border mb-2 rounded"
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 ${
            isEditing ? 'bg-green-600' : 'bg-blue-600'
          } text-white rounded`}
        >
          {isEditing ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    )
  }

  return (
    <>
      <Metadata title="Agents" description="Agents CRUD page" />
      <MainLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách Agents</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAddAgent}
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Thêm Agent
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {data.agents.map((agent) => (
          <div
            key={agent.id}
            className="p-4 bg-gray-100 rounded shadow flex flex-col items-center"
          >
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <h2 className="text-lg font-semibold">{agent.name}</h2>
            <p className="text-sm text-gray-600">{agent.settings}</p>

            <div className="flex space-x-2 mt-3">
              <button
                className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                onClick={() => handleEditAgent(agent.id)}
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(agent.id)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup hiển thị nội dung động */}
      <Popup
        title={isEditing ? 'Chỉnh sửa Agent' : 'Thêm Agent'}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      >
        {renderAgentForm()}
      </Popup>
      </MainLayout>
    </>
  )
}

export default AgentsPage
