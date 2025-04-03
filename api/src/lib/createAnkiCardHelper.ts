import { db } from './db'

export const createAnkiCard = async ({ front, back, tagIds = [], point = -3 }) => {
  return await db.ankiCard.create({
    data: {
      front,
      back,
      enrollAt: new Date(),
      point,
      tags: {
        connect: tagIds.map((id) => ({ id })),
      },
    },
    include: { tags: true },
  })
}
