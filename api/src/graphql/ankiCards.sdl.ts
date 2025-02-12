export const schema = gql`
  type AnkiCard {
    id: Int!
    front: String!
    back: String!
    tags: [AnkiTag]! # Quan hệ nhiều-nhiều
    schedule: AnkiSch
    createdAt: DateTime!
  }

  type Query {
    ankiCards: [AnkiCard!]! @skipAuth
    ankiCards(searchTerm: String, tagIds: [Int!], skip: Int, take: Int): [AnkiCard!]! @skipAuth
  }

  input CreateAnkiCardInput {
    front: String!
    back: String!
    tagIds: [Int!]! # Chấp nhận danh sách ID của Tag
  }

  input UpdateAnkiCardInput {
    front: String
    back: String
    tagIds: [Int!]
  }

  type Mutation {
    createAnkiCard(input: CreateAnkiCardInput!): AnkiCard! @skipAuth
    updateAnkiCard(id: Int!, input: UpdateAnkiCardInput!): AnkiCard! @skipAuth
    deleteAnkiCard(id: Int!): AnkiCard! @skipAuth 
  }
`
