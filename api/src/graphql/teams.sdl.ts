export const schema = gql`
  type Team {
    id: Int!
    name: String!
    agents: [Agent!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    teams: [Team!]! @skipAuth
    team(id: Int!): Team @skipAuth
  }

  input CreateTeamInput {
    name: String!
  }

  input UpdateTeamInput {
    name: String
  }

  type Mutation {
    createTeam(input: CreateTeamInput!): Team! @skipAuth
    updateTeam(id: Int!, input: UpdateTeamInput!): Team! @skipAuth
    deleteTeam(id: Int!): Team! @skipAuth
  }
`
