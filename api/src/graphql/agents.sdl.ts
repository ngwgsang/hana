export const schema = gql`
  type Agent {
    id: Int!
    avatar: String!
    name: String!
    settings: String!
    team: Team!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Query để lấy danh sách hoặc chi tiết Agent
  type Query {
    agents: [Agent!]! @skipAuth
    agent(id: Int!): Agent @skipAuth
  }

  # Input cho việc tạo mới Agent
  input CreateAgentInput {
    avatar: String!
    name: String!
    settings: String!
    teamId: Int!
  }

  # Input cho việc cập nhật Agent
  input UpdateAgentInput {
    avatar: String
    name: String
    settings: String
    teamId: Int
  }

  # Mutation CRUD cho Agent
  type Mutation {
    createAgent(input: CreateAgentInput!): Agent! @skipAuth
    updateAgent(id: Int!, input: UpdateAgentInput!): Agent! @skipAuth
    deleteAgent(id: Int!): Agent! @skipAuth
  }
`
