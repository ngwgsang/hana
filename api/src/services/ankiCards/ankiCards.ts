import type { MutationResolvers } from 'types/graphql'
import { db } from 'src/lib/db'

export const createAnkiCard: MutationResolvers['createAnkiCard'] = ({ input }) => {
  return db.ankiCard.create({
    data: {
      front: input.front,
      back: input.back,
      tags: {
        connect: input.tagIds.map((tagId) => ({ id: tagId })), // Sửa lỗi này
      },
    },
    include: {
      tags: true,
    },
  })
}

export const updateAnkiCard: MutationResolvers['updateAnkiCard'] = ({ id, input }) => {
  return db.ankiCard.update({
    where: { id },
    data: {
      front: input.front,
      back: input.back,
      tags: input.tagIds
        ? { set: [], connect: input.tagIds.map((tagId) => ({ id: tagId })) } // Cập nhật lại tag
        : undefined,
    },
    include: {
      tags: true,
    },
  })
}

export const ankiCards: QueryResolvers['ankiCards'] = ({ searchTerm, tagIds }) => {
  return db.ankiCard.findMany({
    where: {
      AND: [
        searchTerm
          ? {
              OR: [
                { front: { contains: searchTerm, mode: 'insensitive' } },
                { back: { contains: searchTerm, mode: 'insensitive' } },
              ],
            }
          : {},
        tagIds && tagIds.length > 0
          ? {
              tags: {
                some: {
                  id: { in: tagIds },
                },
              },
            }
          : {},
      ],
    },
    include: { tags: true },
  })
}

export const deleteAnkiCard: MutationResolvers['deleteAnkiCard'] = async ({ id }) => {
  return db.ankiCard.delete({
    where: { id },
  })
}

export const bulkCreateAnkiCards: MutationResolvers['bulkCreateAnkiCards'] = async ({ input }) => {
  return Promise.all(
    input.map(async (card) => {
      return db.ankiCard.create({
        data: {
          front: card.front,
          back: card.back,
          tags: {
            connect: [{ id: 1 }], // Gán mặc định tag ID = 0
          },
        },
        include: { tags: true },
      })
    })
  )
}




