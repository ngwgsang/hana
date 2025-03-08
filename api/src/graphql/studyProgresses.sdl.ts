export const schema = gql`
  type StudyProgress {
    id: String!
    date: DateTime!
    goodCount: Int!
    normalCount: Int!
    badCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CountResult {
    count: Int!
  }

  type StudyProgressSummary {
    goodCount: Int
    normalCount: Int
    badCount: Int
  }

  type AnkiCard {
    id: Int!
    front: String!
    back: String!
    createdAt: DateTime!
  }

  type AnkiCardSummary {
    count: Int!
    cards: [AnkiCard!]!
  }

  type StudyProgressByDay {
    date: DateTime!
    goodCount: Int!
    normalCount: Int!
    badCount: Int!
  }

  type Mutation {
    updateStudyProgress(status: String!): StudyProgress! @skipAuth
  }

  type Query {
    studyProgressByDate(date: DateTime!): StudyProgress @skipAuth
    studyProgressByRange(startDate: DateTime!, endDate: DateTime!): StudyProgressSummary @skipAuth
    studyProgressByWeek(startDate: DateTime!, endDate: DateTime!): [StudyProgressByDay!]! @skipAuth
    ankiCardsByDate(date: DateTime!): AnkiCardSummary! @skipAuth
    ankiCardsByRange(startDate: DateTime!, endDate: DateTime!): AnkiCardSummary! @skipAuth
  }
`

