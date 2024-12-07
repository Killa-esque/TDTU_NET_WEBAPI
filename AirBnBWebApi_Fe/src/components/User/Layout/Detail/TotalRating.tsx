import React from 'react'

type Props = {}

const TotalRating: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-base tracking-wide text-gray-700">Mức độ sạch sẽ</div>
        <div className="flex items-center">
          <div className="relative w-32 bg-gray-300 rounded-full h-3">
            <div className="absolute h-3 bg-pink-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="ml-4 text-pink-500 font-semibold">5,0</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-base tracking-wide text-gray-700">Độ chính xác</div>
        <div className="flex items-center">
          <div className="relative w-32 bg-gray-300 rounded-full h-3">
            <div className="absolute h-3 bg-pink-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="ml-4 text-pink-500 font-semibold">5,0</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-base tracking-wide text-gray-700">Giao tiếp</div>
        <div className="flex items-center">
          <div className="relative w-32 bg-gray-300 rounded-full h-3">
            <div className="absolute h-3 bg-pink-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="ml-4 text-pink-500 font-semibold">5,0</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-base tracking-wide text-gray-700">Vị trí</div>
        <div className="flex items-center">
          <div className="relative w-32 bg-gray-300 rounded-full h-3">
            <div className="absolute h-3 bg-pink-500 rounded-full" style={{ width: '95%' }}></div>
          </div>
          <div className="ml-4 text-pink-500 font-semibold">4,9</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-base tracking-wide text-gray-700">Nhận phòng</div>
        <div className="flex items-center">
          <div className="relative w-32 bg-gray-300 rounded-full h-3">
            <div className="absolute h-3 bg-pink-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="ml-4 text-pink-500 font-semibold">5,0</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-base tracking-wide text-gray-700">Giá trị</div>
        <div className="flex items-center">
          <div className="relative w-32 bg-gray-300 rounded-full h-3">
            <div className="absolute h-3 bg-pink-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="ml-4 text-pink-500 font-semibold">5,0</div>
        </div>
      </div>
    </>
  )
}

export default TotalRating;


