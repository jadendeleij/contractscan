import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Pagina niet gevonden</h1>
      <p className="text-slate-500 text-lg max-w-md mb-8">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar home
      </Link>
    </div>
  );
}
