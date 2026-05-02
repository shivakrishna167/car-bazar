'use client'

export default function VehicleSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md animate-pulse flex flex-col h-full">
      <div className="aspect-[16/10] bg-gray-200 relative">
        <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300/50 rounded-lg" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-7 bg-gray-200 rounded-xl w-3/4 mb-3" />
        <div className="h-4 bg-gray-100 rounded-lg w-1/4 mb-6" />
        
        <div className="h-10 bg-blue-50 rounded-xl w-1/2 mb-8" />
        
        <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded-full" />
            <div className="h-3 bg-gray-100 rounded-lg w-16" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded-full" />
            <div className="h-3 bg-gray-100 rounded-lg w-16" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded-full" />
            <div className="h-3 bg-gray-100 rounded-lg w-16" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded-full" />
            <div className="h-3 bg-gray-100 rounded-lg w-16" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="h-14 bg-blue-600/10 rounded-2xl" />
          <div className="h-14 bg-blue-600/10 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
