import { db } from 'src/lib/db'

export const updateStudyProgress = async ({ status }) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Đưa về đầu ngày để so sánh

  // Kiểm tra xem đã có dữ liệu hôm nay chưa
  let progress = await db.studyProgress.findFirst({
    where: { date: today },
  })

  if (!progress) {
    progress = await db.studyProgress.create({
      data: { date: today, goodCount: 0, normalCount: 0, badCount: 0 },
    })
  }

  // Cập nhật số lần chọn trạng thái
  let updateData = {}
  if (status === 'good') updateData = { goodCount: progress.goodCount + 1 }
  if (status === 'normal') updateData = { normalCount: progress.normalCount + 1 }
  if (status === 'bad') updateData = { badCount: progress.badCount + 1 }

  return db.studyProgress.update({
    where: { id: progress.id },
    data: updateData,
  })
}

export const studyProgressByDate = async ({ date }) => {
  const parsedDate = new Date(date)
  parsedDate.setHours(0, 0, 0, 0) // Đảm bảo về đầu ngày

  console.log("🔍 Fetching studyProgress for:", parsedDate) // Debug log

  return db.studyProgress.findFirst({
    where: { date: parsedDate },
  })
}


export const studyProgressByRange = async ({ startDate, endDate }) => {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  console.log("🔍 Fetching studyProgressByRange:", start, "to", end) // Debug log

  const result = await db.studyProgress.aggregate({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      goodCount: true,
      normalCount: true,
      badCount: true,
    },
  })

  console.log("✅ Aggregated result:", result) // Debug log

  return {
    goodCount: result._sum.goodCount ?? 0, // Đảm bảo không trả về null
    normalCount: result._sum.normalCount ?? 0,
    badCount: result._sum.badCount ?? 0,
  }
}

export const studyProgressByWeek = async ({ startDate, endDate }) => {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const results = await db.studyProgress.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    select: {
      date: true,
      goodCount: true,
      normalCount: true,
      badCount: true,
    },
    orderBy: {
      date: 'asc', // Sắp xếp theo ngày tăng dần
    },
  })

  return results
}
