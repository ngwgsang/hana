import { gql } from '@redwoodjs/web'

export const GET_ANKI_CARDS = gql`
  query GetAnkiCards($searchTerm: String, $tagIds: [Int!]) {
    ankiCards(searchTerm: $searchTerm, tagIds: $tagIds) {
      id
      front
      back
      createdAt
      point
      tags {
        id
        name
      }
    }
  }
`

export const CREATE_ANKI_CARD = gql`
  mutation CreateAnkiCard($input: CreateAnkiCardInput!) {
    createAnkiCard(input: $input) {
      id
      front
      back
      enrollAt
      point
      tags {
        id
        name
      }
    }
  }
`

export const UPDATE_ANKI_CARD = gql`
  mutation UpdateAnkiCard($id: Int!, $input: UpdateAnkiCardInput!) {
    updateAnkiCard(id: $id, input: $input) {
      id
      front
      back
      point
      tags {
        id
        name
      }
    }
  }
`

export const DELETE_ANKI_CARD = gql`
  mutation DeleteAnkiCard($id: Int!) {
    deleteAnkiCard(id: $id) {
      id
    }
  }
`
export const BULK_CREATE_ANKI_CARDS = gql`
  mutation BulkCreateAnkiCards($input: BulkCreateAnkiCardsInput!) {
    bulkCreateAnkiCards(input: $input) {
      count
    }
  }
`

export const UPDATE_ANKI_CARD_POINT = gql`
  mutation UpdateAnkiCardPoint($id: Int!, $pointChange: Int!) {
    updateAnkiCardPoint(id: $id, pointChange: $pointChange) {
      id
      point
    }
  }
`