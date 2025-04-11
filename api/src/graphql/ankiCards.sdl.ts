export const schema = gql`
  type AnkiCard {
    id: Int!
    front: String!
    back: String!
    tags: [AnkiTag]! # Quan hệ nhiều-nhiều với tag
    createdAt: DateTime! # Ngày tạo thẻ
    enrollAt: DateTime # Ngày bắt đầu luyện tập
    point: Int! # Điểm số của thẻ
  }

  type AnkiTag {
    id: Int!
    name: String!
    cards: [AnkiCard!]! # Quan hệ nhiều-nhiều với AnkiCard
  }

  type Query {
    ankiCards(searchTerm: String, tagIds: [Int!], skip: Int, take: Int): [AnkiCard!]! @skipAuth
  }

  input CreateAnkiCardInput {
    front: String!
    back: String!
    tagIds: [Int!]! # Danh sách ID của Tag
    enrollAt: DateTime # Có thể đặt ngày luyện tập (hoặc mặc định là ngày hiện tại)
    point: Int # Điểm số ban đầu (mặc định là 0)
  }

  input UpdateAnkiCardInput {
    front: String
    back: String
    tagIds: [Int!]
    enrollAt: DateTime
    point: Int
  }

  type BulkCreateResult {
    count: Int!
  }

  type Mutation {
    createAnkiCard(input: CreateAnkiCardInput!): AnkiCard! @skipAuth
    updateAnkiCard(id: Int!, input: UpdateAnkiCardInput!): AnkiCard! @skipAuth
    deleteAnkiCard(id: Int!): AnkiCard! @skipAuth
    bulkCreateAnkiCards(input: [CreateAnkiCardInput!]!): BulkCreateResult! @skipAuth
    updateAnkiCardPoint(id: Int!, pointChange: Int!): AnkiCard! @skipAuth
  }
`
