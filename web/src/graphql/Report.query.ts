import { gql } from '@redwoodjs/web'

export const GET_DAILY_REPORT = gql`
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

export const GET_WEEKLY_REPORT = gql`
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

export const GET_WEEKLY_PROGRESS = gql`
  query GetWeeklyProgress($startDate: DateTime!, $endDate: DateTime!) {
    studyProgressByWeek(startDate: $startDate, endDate: $endDate) {
      date
      goodCount
      normalCount
      badCount
    }
  }
`

export const GET_SCATTER_DATA = gql`
  query GetScatterData {
    ankiCards {
      front
      enrollAt
      point
    }
  }
`

export const UPDATE_STUDY_PROGRESS = gql`
mutation UpdateStudyProgress($status: String!) {
  updateStudyProgress(status: $status) {
    goodCount
    normalCount
    badCount
  }
}
`
