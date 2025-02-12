import type {
  QueryResolvers,
  MutationResolvers,
  AnkiTagRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const ankiTags: QueryResolvers['ankiTags'] = () => {
  return db.ankiTag.findMany()
}

export const ankiTag: QueryResolvers['ankiTag'] = ({ id }) => {
  return db.ankiTag.findUnique({
    where: { id },
  })
}

export const createAnkiTag: MutationResolvers['createAnkiTag'] = ({
  input,
}) => {
  return db.ankiTag.create({
    data: input,
  })
}

export const updateAnkiTag: MutationResolvers['updateAnkiTag'] = ({
  id,
  input,
}) => {
  return db.ankiTag.update({
    data: input,
    where: { id },
  })
}

export const deleteAnkiTag: MutationResolvers['deleteAnkiTag'] = ({ id }) => {
  return db.ankiTag.delete({
    where: { id },
  })
}

export const AnkiTag: AnkiTagRelationResolvers = {
  cards: (_obj, { root }) => {
    return db.ankiTag.findUnique({ where: { id: root?.id } }).cards()
  },
}
