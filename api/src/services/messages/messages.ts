import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const messages: QueryResolvers['messages'] = () => {
  return db.message.findMany()
}

export const message: QueryResolvers['message'] = ({ id }) => {
  return db.message.findUnique({
    where: { id },
  })
}

export const createMessage: MutationResolvers['createMessage'] = ({
  input,
}) => {
  return db.message.create({
    data: input,
  })
}

export const updateMessage: MutationResolvers['updateMessage'] = ({
  id,
  input,
}) => {
  return db.message.update({
    data: input,
    where: { id },
  })
}

export const deleteMessage: MutationResolvers['deleteMessage'] = ({ id }) => {
  return db.message.delete({
    where: { id },
  })
}
