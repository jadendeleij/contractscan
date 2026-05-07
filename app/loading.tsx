export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-40">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
