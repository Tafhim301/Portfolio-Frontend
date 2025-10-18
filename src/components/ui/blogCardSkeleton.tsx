export default function BlogCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white animate-pulse">
      <div className="w-full h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
