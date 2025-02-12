import type { MutationResolvers } from 'types/graphql'
import { db } from 'src/lib/db'

export const createAnkiSch: MutationResolvers['createAnkiSch'] = ({ input }) => {
  return db.ankiSch.create({
    data: {
      createdAt: input.createdAt,
      enrollAt: input.enrollAt,
      point: input.point,
      card: {
        connect: { id: input.cardId }, // ✅ Liên kết với AnkiCard qua cardId
      },
    },
    include: {
      card: true,
    },
  })
}

export const updateAnkiSch: MutationResolvers['updateAnkiSch'] = ({ id, input }) => {
  return db.ankiSch.update({
    where: { id },
    data: input,
  })
}
