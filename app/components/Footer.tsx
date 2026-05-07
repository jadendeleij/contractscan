export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">ContractScan <span className="text-blue-400">AI</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Scan, begrijp en vergelijk contracten in seconden met de kracht van AI. Voor iedereen die slimmer wil ondertekenen.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Hoe het werkt</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Voordelen</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prijzen</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Juridisch</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacybeleid</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gebruiksvoorwaarden</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookiebeleid</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} ContractScan AI. Alle rechten voorbehouden.</p>
          <p className="text-slate-600">Gemaakt in Nederland 🇳🇱</p>
        </div>
      </div>
    </footer>
  );
}
