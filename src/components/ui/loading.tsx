export function Loading() {
  return (
    <div className="flex items-center justify-center h-fit bg-transparent">
      <div className="relative w-6 h-6">
        <div className="absolute inset-0 border-2 border-transparent border-t-inherit border-r-inherit rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-2 border-transparent border-t-inherit border-r-inherit rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
}
