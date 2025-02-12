export const schema = gql`
  type AnkiSch {
    id: Int!
    createdAt: DateTime!
    enrollAt: DateTime
    point: Int!
    card: AnkiCard!
  }

  type Query {
    ankiSches: [AnkiSch!]! @skipAuth
  }

  input CreateAnkiSchInput {
    createdAt: DateTime! # ✅ Thêm createdAt
    enrollAt: DateTime
    point: Int!
    cardId: Int! # ✅ Thêm cardId để liên kết với AnkiCard
  }

  input UpdateAnkiSchInput {
    enrollAt: DateTime
    point: Int
  }

  type Mutation {
    createAnkiSch(input: CreateAnkiSchInput!): AnkiSch! @skipAuth
    updateAnkiSch(id: Int!, input: UpdateAnkiSchInput!): AnkiSch! @skipAuth
  }
`
