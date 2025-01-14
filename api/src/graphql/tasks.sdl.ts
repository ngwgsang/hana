export const schema = gql`
  type Task {
    id: Int!
    name: String!
    config: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    tasks: [Task!]! @skipAuth
    task(id: Int!): Task @skipAuth
  }

  input CreateTaskInput {
    name: String!
    config: String!
  }

  input UpdateTaskInput {
    name: String
    config: String
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task! @skipAuth
    updateTask(id: Int!, input: UpdateTaskInput!): Task! @skipAuth
    deleteTask(id: Int!): Task! @skipAuth
  }
`
