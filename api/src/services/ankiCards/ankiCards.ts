import type { MutationResolvers } from 'types/graphql'
import { db } from 'src/lib/db'

// ✅ Tạo thẻ mới, mặc định enrollAt là ngày hiện tại, point = 0
export const createAnkiCard: MutationResolvers['createAnkiCard'] = async ({ input }) => {
  const newCard = await db.ankiCard.create({
    data: {
      front: input.front,
      back: input.back,
      enrollAt: new Date(),
      point: -3, // Điểm ban đầu là 0
      tags: input.tagIds?.length
        ? { connect: input.tagIds.map((tagId) => ({ id: tagId })) }
        : undefined, // Nếu có tag thì gán, nếu không thì bỏ qua
    },
    include: {
      tags: true,
    },
  })

  return newCard
}

// ✅ Cập nhật thẻ
export const updateAnkiCard: MutationResolvers['updateAnkiCard'] = ({ id, input }) => {
  return db.ankiCard.update({
    where: { id },
    data: {
      front: input.front,
      back: input.back,
      enrollAt: input.enrollAt ?? new Date(), // ✅ Nếu không có thì gán hôm nay
      point: input.point ?? undefined, // Chỉ cập nhật nếu có giá trị
      tags: input.tagIds
        ? { set: [], connect: input.tagIds.map((tagId) => ({ id: tagId })) } // Cập nhật lại tag
        : undefined,
    },
    include: {
      tags: true,
    },
  })
}

// ✅ Truy vấn danh sách thẻ với bộ lọc
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

// ✅ Xóa thẻ
export const deleteAnkiCard: MutationResolvers['deleteAnkiCard'] = async ({ id }) => {
  return db.ankiCard.delete({
    where: { id },
  })
}

// ✅ Thêm nhiều thẻ từ CSV
// export const bulkCreateAnkiCards: MutationResolvers['bulkCreateAnkiCards'] = async ({ input }) => {
//   return Promise.all(
//     input.map(async (card) => {
//       const newCard = await db.ankiCard.create({
//         data: {
//           front: card.front,
//           back: card.back,
//           enrollAt: new Date(),
//           point: -3,
//           tags: {
//             connect: [{ id: 2 }],
//           },
//         },
//       })
//       return newCard
//     })
//   )
// }
// export const bulkCreateAnkiCards: MutationResolvers['bulkCreateAnkiCards'] = async ({ input }) => {
//   const result = await db.ankiCard.createMany({
//     data: input.map((card) => ({
//       front: card.front,
//       back: card.back,
//       enrollAt: new Date(),
//       point: -3,
//     })),
//     skipDuplicates: true,
//   })

//   return { count: result.count } // <-- update schema để trả về số lượng
// }
// ✅ Thêm nhiều thẻ từ CSV + truyền tagId từ client
// export const bulkCreateAnkiCards: MutationResolvers['bulkCreateAnkiCards'] = async ({ input }) => {
//   const { cards, tagId } = input

//   const created = await db.ankiCard.createMany({
//     data: cards.map((card) => ({
//       front: card.front,
//       back: card.back,
//       enrollAt: new Date(),
//       point: -3,
//     })),
//     skipDuplicates: true,
//   })

//   const fronts = cards.map((c) => c.front)
//   const createdCards = await db.ankiCard.findMany({
//     where: { front: { in: fronts } },
//     select: { id: true },
//   })

//   // Sử dụng SQL trực tiếp thay cho việc cập nhập gián tiếp
//   const values = createdCards.map((card) => `(${card.id}, ${tagId})`).join(', ')
//   await db.$executeRawUnsafe(
//     `INSERT INTO "_AnkiCardToAnkiTag" ("A", "B") VALUES ${values} ON CONFLICT DO NOTHING`
//   )

//   return { count: created.count }
// }
export const bulkCreateAnkiCards: MutationResolvers['bulkCreateAnkiCards'] = async ({ input }) => {
  const { cards, tagIds } = input

  const created = await db.ankiCard.createMany({
    data: cards.map((card) => ({
      front: card.front,
      back: card.back,
      enrollAt: new Date(),
      point: -3,
    })),
    skipDuplicates: true,
  })

  const fronts = cards.map((c) => c.front)
  const createdCards = await db.ankiCard.findMany({
    where: { front: { in: fronts } },
    select: { id: true, front: true },
  })

  const relations = []
  for (const createdCard of createdCards) {
    for (const tagId of tagIds) {
      relations.push(`(${createdCard.id}, ${tagId})`)
    }
  }

  if (relations.length > 0) {
    await db.$executeRawUnsafe(`
      INSERT INTO "_AnkiCardToAnkiTag" ("A", "B")
      VALUES ${relations.join(', ')}
      ON CONFLICT DO NOTHING
    `)
  }

  return { count: created.count }
}



export const updateAnkiCardPoint: MutationResolvers['updateAnkiCardPoint'] = async ({ id, pointChange }) => {
  return db.ankiCard.update({
    where: { id },
    data: {
      enrollAt: new Date(),
      point: {
        increment: pointChange, // Cộng dồn vào điểm hiện tại
      },
    },
  })
}


export const ankiCardsByDate = async ({ date }) => {
  const parsedDate = new Date(date)
  parsedDate.setHours(0, 0, 0, 0)

  const nextDay = new Date(parsedDate)
  nextDay.setDate(nextDay.getDate() + 1)

  const cards = await db.ankiCard.findMany({
    where: {
      createdAt: {
        gte: parsedDate,
        lt: nextDay,
      },
    },
    select: { front: true }, // Chỉ lấy giá trị front
  })

  return {
    count: cards.length,
    cards,
  }
}


export const ankiCardsByRange = async ({ startDate, endDate }) => {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const cards = await db.ankiCard.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: { front: true }, // Chỉ lấy giá trị front
  })

  return {
    count: cards.length,
    cards,
  }
}
