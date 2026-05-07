export default function AuthLoading() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 animate-pulse">
        <div className="h-7 bg-slate-100 rounded-lg w-2/3 mb-2" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-7" />
        <div className="h-11 bg-slate-100 rounded-xl mb-6" />
        <div className="h-px bg-slate-100 mb-6" />
        <div className="flex flex-col gap-4">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-blue-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
