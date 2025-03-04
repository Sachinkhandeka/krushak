import React from 'react'

const LoadingFallback = () => {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen gap-4">
        <div className="relative flex items-center" >
            <div className="p-4 rounded-full border-4 border-b-0 border-l-0 border-green-500 animate-spin" ></div>
        </div>
        <p className="text-gray-500 animate-bounce my-2" >Loading...</p>
    </div>
  )
}

export default LoadingFallback