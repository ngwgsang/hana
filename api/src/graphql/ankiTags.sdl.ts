export const schema = gql`
  type AnkiTag {
    id: Int!
    name: String!
    cards: [AnkiCard]!
  }

  type Query {
    ankiTags: [AnkiTag!]! @requireAuth
    ankiTag(id: Int!): AnkiTag @requireAuth
  }

  input CreateAnkiTagInput {
    name: String!
  }

  input UpdateAnkiTagInput {
    name: String
  }

  type Mutation {
    createAnkiTag(input: CreateAnkiTagInput!): AnkiTag! @requireAuth
    updateAnkiTag(id: Int!, input: UpdateAnkiTagInput!): AnkiTag! @requireAuth
    deleteAnkiTag(id: Int!): AnkiTag! @requireAuth
  }
`
