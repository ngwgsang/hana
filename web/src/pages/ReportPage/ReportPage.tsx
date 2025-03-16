import { useQuery } from '@redwoodjs/web'
import { useState, useEffect, useRef, useCallback } from 'react'
import { format, subDays, startOfWeek, endOfWeek, formatISO } from 'date-fns'
import {GET_DAILY_REPORT, GET_WEEKLY_REPORT, GET_WEEKLY_PROGRESS, GET_SCATTER_DATA  } from '../HomePage/HomPage.query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart , Scatter } from 'recharts'
import { Link, navigate } from '@redwoodjs/router'
import { AcademicCapIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { useGlobal } from 'src/context/GlobalContext'
import ExternalUrl from 'src/components/ExternalUrl/ExternalUrl'
import useSpacedRepetition from 'src/hook/useSpacedRepetition'


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded shadow-lg">
        <ExternalUrl href={`https://mazii.net/vi-VN/search/word/javi/${payload[0].payload.front}`} >{payload[0].payload.front}</ExternalUrl>
      </div>
    );
  }
  return null;
};

const ReportPage = () => {

  const global = useGlobal();
  useEffect(() => {
    if (global.isAuth == false) {
      navigate("/login")
    }
  }, [])

  const today = formatISO(new Date(), { representation: 'complete' }) // YYYY-MM-DDTHH:mm:ss.sssZ
  const yesterday = formatISO(subDays(new Date(), 1), { representation: 'complete' })
  const weekStart = formatISO(startOfWeek(new Date()), { representation: 'complete' })
  const weekEnd = formatISO(endOfWeek(new Date()), { representation: 'complete' })

  const { data: dailyData, loading: loadingDaily } = useQuery(GET_DAILY_REPORT, {
    variables: { date: today },
  })
  const { data: yesterdayData } = useQuery(GET_DAILY_REPORT, {
    variables: { date: yesterday },
  })
  const { data: weeklyData, loading: loadingWeekly } = useQuery(GET_WEEKLY_REPORT, {
    variables: { startDate: weekStart, endDate: weekEnd },
    onCompleted: (data) => {
      // console.log("✅ Weekly Data:", data)
    },
  })
  const { data: weeklyProgressData, loading: loadingProgress } = useQuery(GET_WEEKLY_PROGRESS, {
    variables: { startDate: weekStart, endDate: weekEnd },
  })

  const { data: scatterData, loading: loadingScatter } = useQuery(GET_SCATTER_DATA)


  const getDifference = (todayValue, yesterdayValue) => {
    if (yesterdayValue === undefined || todayValue === undefined) return 'N/A'
    const diff = todayValue - yesterdayValue
    return diff > 0 ? `+${diff}` : diff
  }


  const scatterPlotData = scatterData?.ankiCards
  .filter(card => card.enrollAt) // Bỏ qua thẻ không có enrollAt
  .map((card) => {
    const { reviewScore, daysSinceEnroll } = useSpacedRepetition(card.point, card.enrollAt);

    return {
      x: daysSinceEnroll,  // Trục X là số ngày từ khi thêm
      y: reviewScore,      // Trục Y sử dụng reviewScore
      front: card.front,   // Nội dung thẻ
    };
  })
  .filter(point => point !== null) // Bỏ các điểm bị null
  .sort((a, b) => a.y - b.y); // Sắp xếp theo reviewScore



  const chartData = weeklyProgressData?.studyProgressByWeek.map((day) => ({
    date: format(new Date(day.date), 'EEE'), // Hiển thị thứ trong tuần
    good: day.goodCount,
    normal: day.normalCount,
    bad: day.badCount,
  })) || []


  return (
    <main className="p-4 mx-auto w-full sm:w-3/4 lg:w-1/2 flex flex-col relative">
      <h1 className="text-xl font-bold mb-4 text-white">🍃Báo Cáo Học Tập</h1>

      <div className="bg-gray-800 text-white p-4 rounded mb-4">
        <h2 className="text-lg font-bold mb-2">Hôm nay</h2>
        {loadingDaily ? (
          <p>Đang tải...</p>
        ) : (
          <div className='flex flex-col gap-2'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
            <div className='relative border-4 rounded-md border-green-400 bg-green-400/10 h-32 flex items-center justify-center'>
              <span className='absolute top-1 left-1 text-sm px-2 py-1 text-green-400'>🤗 Nhớ rõ</span>
              <span className='font-semibold text-2xl'>{dailyData?.studyProgressByDate?.goodCount ?? 0} {' '}</span>
              <span className="absolute bottom-2 right-2 text-sm text-gray-400">({getDifference(dailyData?.studyProgressByDate?.goodCount, yesterdayData?.studyProgressByDate?.goodCount)} lần)</span>
            </div>
            <div className='relative border-4 rounded-md border-orange-400 bg-orange-400/10 h-32 flex items-center justify-center'>
              <span className='absolute top-1 left-1 text-sm px-2 py-1 text-orange-400'>😳 Chưa nắm</span>
              <span className='font-semibold text-2xl'>{dailyData?.studyProgressByDate?.normalCount ?? 0} {' '}</span>
              <span className="absolute bottom-2 right-2 text-sm text-gray-400">({getDifference(dailyData?.studyProgressByDate?.normalCount, yesterdayData?.studyProgressByDate?.normalCount)} lần)</span>
            </div>
            <div className='relative border-4 rounded-md border-red-400 bg-red-400/10 h-32 flex items-center justify-center'>
              <span className='absolute top-1 left-1 text-sm px-2 py-1 text-red-400'>😱 Không biết gì luôn</span>
              <span className='font-semibold text-2xl'>{dailyData?.studyProgressByDate?.badCount ?? 0} {' '}</span>
              <span className="absolute bottom-2 right-2 text-sm text-gray-400">({getDifference(dailyData?.studyProgressByDate?.badCount, yesterdayData?.studyProgressByDate?.badCount)} lần) </span>
            </div>
          </div>
          <div className='relative border-4 rounded-md border-blue-500 bg-blue-500/10 h-32 flex items-center justify-center grid-cols-3'>
            <span className='absolute top-1 left-1 text-sm px-2 py-1 text-blue-400'>💫 Số thẻ mới</span>
            <span className='font-semibold text-2xl'>{dailyData?.ankiCardsByDate?.count}</span>
            <span className="absolute bottom-2 right-2 text-sm text-gray-400">({getDifference(dailyData?.ankiCardsByDate?.count, yesterdayData?.ankiCardsByDate?.count)} thẻ)</span>
          </div>
              {dailyData?.ankiCardsByDate?.cards.length > 0 &&
              <>
                <p className="block text-white">Thẻ mới hôm nay</p>
                <ul className="mt-1 text-sm text-gray-300 flex gap-1 flex-wrap">
                  {dailyData.ankiCardsByDate.cards.map((card, index) => (
                    <ExternalUrl href={`https://mazii.net/vi-VN/search/word/javi/${card.front}`} key={index} className="border-2 border-gray-600 px-2 py-1 rounded-md hover:bg-blue-500/10 hover:border-blue-500 cursor-pointer">
                      {card.front}
                    </ExternalUrl>
                  ))}
                </ul>
              </>}
          </div>
        )}
      </div>

      <div className="bg-gray-800 text-white p-4 rounded mb-4">
        <h2 className="text-lg font-bold mb-2">Báo cáo tuần ({format(startOfWeek(new Date()), 'yyyy-MM-dd')} - {format(endOfWeek(new Date()), 'yyyy-MM-dd')})</h2>
        {loadingWeekly ? (
          <p>Đang tải...</p>
        ) : (
          <>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
          <div className='relative border-4 rounded-md border-green-400 bg-green-400/10 h-32 flex items-center justify-center'>
            <span className='absolute top-1 left-1 text-sm px-2 py-1 text-green-400'>🤗 Nhớ rõ</span>
            <span className='font-semibold text-2xl'>{weeklyData?.studyProgressByRange?.goodCount ?? 0} {' '}</span>
          </div>
          <div className='relative border-4 rounded-md border-orange-400 bg-orange-400/10 h-32 flex items-center justify-center'>
            <span className='absolute top-1 left-1 text-sm px-2 py-1 text-orange-400'>😳 Chưa nắm</span>
            <span className='font-semibold text-2xl'>{weeklyData?.studyProgressByRange?.normalCount ?? 0} {' '}</span>
          </div>
          <div className='relative border-4 rounded-md border-red-400 bg-red-400/10 h-32 flex items-center justify-center'>
            <span className='absolute top-1 left-1 text-sm px-2 py-1 text-red-400'>😱 Không biết gì luôn</span>
            <span className='font-semibold text-2xl'>{weeklyData?.studyProgressByRange?.badCount ?? 0} {' '}</span>
          </div>
        </div>
          </>
        )}
    <div className="w-full h-64 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="good" stroke="#22c55e" strokeWidth={3} name="Nhớ rõ" />
          <Line type="monotone" dataKey="normal" stroke="#f97316" strokeWidth={3} name="Chưa nắm" />
          <Line type="monotone" dataKey="bad" stroke="#ef4444" strokeWidth={3} name="Không biết gì luôn" />
        </LineChart>
      </ResponsiveContainer>
    </div>


    <div className="bg-gray-800 text-white rounded mt-4">
      {loadingScatter ? (
        <p>Đang tải...</p>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Số ngày từ khi thêm thẻ" unit=" ngày" />
              <YAxis type="number" dataKey="y" name="Review Score" unit="" />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Thẻ" data={scatterPlotData} fill="#38bdf8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>


      </div>

      <div className='fixed right-2 bottom-4 sm:bottom-2 flex gap-2 flex-col-reverse transition-transform'>
        {/* Nút thư viện */}
        <Link
          to='/home'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <AcademicCapIcon className="h-6 w-6 text-white"/>
        </Link>
        <Link
          to='/library'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <Squares2X2Icon className="h-6 w-6 text-white"/>
        </Link>
      </div>
    </main>
  )
}

export default ReportPage
