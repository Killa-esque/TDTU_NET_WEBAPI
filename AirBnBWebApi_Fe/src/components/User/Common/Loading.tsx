import React from 'react'

type Props = {}

function Loading({ }: Props) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="spinner-border animate-spin inline-block w-10 h-10 border-4 rounded-full text-blue-500" role="status">
        <span className="hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Loading
