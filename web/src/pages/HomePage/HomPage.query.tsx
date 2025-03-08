import { gql } from '@redwoodjs/web'



const GET_ANKI_CARDS = gql`
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

// GraphQL Query lấy danh sách tag
const GET_ANKI_TAGS = gql`
  query GetAnkiTags {
    ankiTags {
      id
      name
    }
  }
`

// Mutation tạo thẻ mới
const CREATE_ANKI_CARD = gql`
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

// Mutation cập nhật thẻ
const UPDATE_ANKI_CARD = gql`
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

// Mutation xóa thẻ
const DELETE_ANKI_CARD = gql`
  mutation DeleteAnkiCard($id: Int!) {
    deleteAnkiCard(id: $id) {
      id
    }
  }
`

// Mutation thêm nhiều thẻ từ CSV
const BULK_CREATE_ANKI_CARDS = gql`
  mutation BulkCreateAnkiCards($input: [CreateAnkiCardInput!]!) {
    bulkCreateAnkiCards(input: $input) {
      id
      front
      back
    }
  }
`

const UPDATE_ANKI_CARD_POINT = gql`
  mutation UpdateAnkiCardPoint($id: Int!, $pointChange: Int!) {
    updateAnkiCardPoint(id: $id, pointChange: $pointChange) {
      id
      point
    }
  }
`

const CREATE_ANKI_TAG = gql`
  mutation CreateAnkiTag($input: CreateAnkiTagInput!) {
    createAnkiTag(input: $input) {
      id
      name
    }
  }
`

const DELETE_ANKI_TAG = gql`
  mutation DeleteAnkiTag($id: Int!) {
    deleteAnkiTag(id: $id) {
      id
    }
  }
`

const GET_DAILY_REPORT = gql`
  query GetDailyReport($date: DateTime!) {
    studyProgressByDate(date: $date) {
      goodCount
      normalCount
      badCount
    }
    ankiCardsByDate(date: $date) {
      count
      cards {
        front
      }
    }
  }
`

const GET_WEEKLY_REPORT = gql`
  query GetWeeklyReport($startDate: DateTime!, $endDate: DateTime!) {
    studyProgressByRange(startDate: $startDate, endDate: $endDate) {
      goodCount
      normalCount
      badCount
    }
    ankiCardsByRange(startDate: $startDate, endDate: $endDate) {
      count
      cards {
        front
      }
    }
  }
`

const GET_WEEKLY_PROGRESS = gql`
  query GetWeeklyProgress($startDate: DateTime!, $endDate: DateTime!) {
    studyProgressByWeek(startDate: $startDate, endDate: $endDate) {
      date
      goodCount
      normalCount
      badCount
    }
  }
`



export {
  BULK_CREATE_ANKI_CARDS,
  GET_ANKI_CARDS,
  GET_ANKI_TAGS,
  CREATE_ANKI_CARD,
  CREATE_ANKI_TAG,
  UPDATE_ANKI_CARD,
  UPDATE_ANKI_CARD_POINT,
  DELETE_ANKI_CARD,
  DELETE_ANKI_TAG,
  GET_DAILY_REPORT,
  GET_WEEKLY_REPORT,
  GET_WEEKLY_PROGRESS
}