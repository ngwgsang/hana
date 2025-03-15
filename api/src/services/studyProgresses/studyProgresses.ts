import { db } from 'src/lib/db'

export const updateStudyProgress = async ({ status }) => {
  // Lấy giờ hiện tại theo múi giờ Việt Nam (GMT+7)
  const now = new Date()
  const vietnamTimeZone = 'Asia/Ho_Chi_Minh'

  // Chuyển đổi sang giờ Việt Nam bằng `Intl.DateTimeFormat`
  const vietnamTime = new Date(
    now.toLocaleString('en-US', { timeZone: vietnamTimeZone })
  )

  // Lấy 00:00:00 của ngày hiện tại tại Việt Nam
  const startOfVietnamDay = new Date(vietnamTime)
  startOfVietnamDay.setHours(0, 0, 0, 0)

  // Chuyển `startOfVietnamDay` về UTC để lưu vào database
  const today = new Date(startOfVietnamDay.getTime() - startOfVietnamDay.getTimezoneOffset() * 60000)

  console.log("🕒 Giờ hiện tại (UTC):", now)
  console.log("🕒 Giờ Việt Nam:", vietnamTime)
  console.log("🕒 Đầu ngày (Vietnam Time):", startOfVietnamDay)
  console.log("🕒 Ngày lưu vào DB (UTC):", today)

  try {
    // 🔍 Tìm bản ghi của ngày hôm nay
    let progress = await db.studyProgress.findFirst({
      where: { date: today },
    })

    console.log("🔍 Kết quả tìm kiếm:", progress)

    // Nếu không có dữ liệu, tạo mới
    if (!progress) {
      console.log("📌 Không tìm thấy, tạo mới bản ghi...")
      progress = await db.studyProgress.create({
        data: { date: today, goodCount: 0, normalCount: 0, badCount: 0 },
      })
      console.log("✅ Đã tạo mới:", progress)
    }

    // Cập nhật số lượng theo trạng thái
    let updateData = {}
    if (status === 'good') updateData = { goodCount: progress.goodCount + 1 }
    if (status === 'normal') updateData = { normalCount: progress.normalCount + 1 }
    if (status === 'bad') updateData = { badCount: progress.badCount + 1 }

    console.log("📌 Dữ liệu cập nhật:", updateData)

    // Cập nhật bản ghi
    const updatedProgress = await db.studyProgress.update({
      where: { id: progress.id },
      data: updateData,
    })

    console.log("✅ Cập nhật thành công:", updatedProgress)

    return updatedProgress
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error)
    throw new Error("Lỗi khi cập nhật dữ liệu!")
  }
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
