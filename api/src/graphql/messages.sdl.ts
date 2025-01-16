export const schema = gql`
  type Message {
    id: Int!
    sender: String!
    content: String!
    isAct: Boolean!
    timestamp: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    messages: [Message!]! @skipAuth
    message(id: Int!): Message @skipAuth
  }

  input CreateMessageInput {
    sender: String!
    content: String!
    isAct: Boolean
  }

  input UpdateMessageInput {
    sender: String
    content: String
    isAct: Boolean
  }

  type Mutation {
    createMessage(input: CreateMessageInput!): Message! @skipAuth
    updateMessage(id: Int!, input: UpdateMessageInput!): Message! @skipAuth
    deleteMessage(id: Int!): Message! @skipAuth
  }
`
