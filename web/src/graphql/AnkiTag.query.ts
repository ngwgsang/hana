import { gql } from '@redwoodjs/web'

export const GET_ANKI_TAGS = gql`
  query GetAnkiTags {
    ankiTags {
      id
      name
    }
  }
`

export const CREATE_ANKI_TAG = gql`
  mutation CreateAnkiTag($input: CreateAnkiTagInput!) {
    createAnkiTag(input: $input) {
      id
      name
    }
  }
`

export const DELETE_ANKI_TAG = gql`
  mutation DeleteAnkiTag($id: Int!) {
    deleteAnkiTag(id: $id) {
      id
    }
  }
`
