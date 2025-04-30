// src/components/StatusPanel/StatusPanel.tsx

import React from 'react'

const statusCategories = [
  { label: 'Cần ôn', key: 'urgent', range: [-999, -2] },
  { label: 'Sắp đến hạn', key: 'upcoming', range: [-2, 0] },
  { label: 'Nhớ rõ', key: 'known', range: [0, 999] },
]

const StatusPanel = ({ cards, onFilterStatus, activeStatus }) => {
  const getCountInRange = (range) => {
    return cards.filter(card => {
      const score = card.reviewScore ?? 0
      return score >= range[0] && score < range[1]
    }).length
  }

  return (
    <div className="">
      <h3 className="text-lg font-bold text-white my-2 hidden lg:flex">Trạng thái ôn tập</h3>
      <div className='bg-blue-500/10 rounded shadow mt-4'>
        {statusCategories.map((status) => (
          <div
            key={status.key}
            className={`text-white cursor-pointer px-3 py-2 rounded flex justify-between items-center transition ${
              activeStatus === status.key ? 'bg-blue-500/10 border border-blue-500 text-blue-500 font-semibold' : ''
            }`}
            onClick={() => onFilterStatus(status.key)}
          >
            <span>{status.label}</span>
            <span className="text-xs text-white">{getCountInRange(status.range)}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default StatusPanel
