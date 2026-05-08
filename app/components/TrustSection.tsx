"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, ShieldCheck, Trash2, Globe, BadgeCheck, ArrowRight, X } from "lucide-react";

type PopupContent = {
  title: string;
  explanation: string;
  blogHref: string;
};

function TechTerm({ children, popup }: { children: React.ReactNode; popup: PopupContent }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-2 font-semibold transition-colors"
      >
        {children}
      </button>

      {open && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 bg-slate-700 border border-slate-600 rounded-xl p-4 shadow-2xl text-left block">
          {/* Arrow */}
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-700 border-l border-t border-slate-600 rotate-45" />

          <span className="flex items-start justify-between gap-2 mb-2">
            <span className="text-white font-bold text-sm leading-snug">{popup.title}</span>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white flex-shrink-0 mt-0.5 transition-colors"
              aria-label="Sluiten"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>

          <span className="text-slate-300 text-xs leading-relaxed block mb-3">
            {popup.explanation}
          </span>

          <a
            href={popup.blogHref}
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors group/rm"
          >
            Lees meer
            <ArrowRight className="w-3 h-3 group-hover/rm:translate-x-0.5 transition-transform" />
          </a>
        </span>
      )}
    </span>
  );
}

const pillars = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Versleuteld tijdens overdracht",
    body: (
      <>
        Elke verbinding is beveiligd met{" "}
        <TechTerm popup={{
          title: "TLS 1.3",
          explanation: "TLS (Transport Layer Security) versleutelt de verbinding tussen uw browser en onze servers. Versie 1.3 is de nieuwste standaard — kwetsbaarheden uit oudere versies zijn volledig verwijderd.",
          blogHref: "/blog/wat-is-tls-encryptie",
        }}>
          TLS 1.3
        </TechTerm>
        , het modernste transportprotocol op het internet. Uw document verlaat uw
        apparaat nooit onversleuteld.
      </>
    ),
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Versleuteld bij tijdelijke opslag",
    body: (
      <>
        Tijdens de analyse slaan wij data tijdelijk op met{" "}
        <TechTerm popup={{
          title: "AES-256-encryptie",
          explanation: "AES-256 (Advanced Encryption Standard) is de wereldstandaard voor dataveiligheid. Met een sleutellengte van 256 bits is het wiskundig onmogelijk om deze encryptie te kraken — ook voor de krachtigste supercomputers.",
          blogHref: "/blog/wat-is-aes-256-encryptie",
        }}>
          AES-256-encryptie
        </TechTerm>
        {" "}— dezelfde standaard die banken en overheden wereldwijd gebruiken voor
        hun meest gevoelige bestanden.
      </>
    ),
  },
  {
    icon: <Trash2 className="w-6 h-6" />,
    title: "Automatisch verwijderd na analyse",
    body: (
      <>
        Zodra uw rapport klaar is, wordt het originele document permanent gewist van onze servers.
        Wij hanteren een strict{" "}
        <TechTerm popup={{
          title: "Zero-retention beleid",
          explanation: "Zero-retention betekent dat wij uw document nooit langer bewaren dan strikt noodzakelijk. Zodra de analyse klaar is, wordt het bestand definitief verwijderd — niet gearchiveerd, niet gebackupt, geen logging van inhoud.",
          blogHref: "/blog/zero-retention-beleid",
        }}>
          zero-retention beleid
        </TechTerm>
        : geen archief, geen back-up, geen logging van inhoud.
      </>
    ),
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "EU-servers & AVG-compliant",
    body: (
      <>
        Al onze infrastructuur staat in Nederland en Duitsland — volledig binnen de{" "}
        <TechTerm popup={{
          title: "AVG (GDPR)",
          explanation: "De Algemene Verordening Gegevensbescherming (AVG) is de Europese privacywet die regelt hoe bedrijven persoonsgegevens mogen verwerken. Naleving is wettelijk verplicht voor alle bedrijven die data van EU-burgers verwerken.",
          blogHref: "/blog/avg-gdpr-uitleg",
        }}>
          AVG / GDPR
        </TechTerm>
        . Uw data verlaat de EU nooit.
      </>
    ),
  },
];

const trustBadges = [
  "AVG / GDPR-compliant",
  "EU-servers (NL & DE)",
  "Zero-retention beleid",
  "AES-256 versleuteling",
  "TLS 1.3 transport",
];

export default function TrustSection() {
  return (
    <section className="bg-slate-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-green-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4" />
            Enterprise-grade beveiliging
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Uw contracten verdienen{" "}
            <span className="text-blue-400">maximale bescherming</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Wij begrijpen dat contracten gevoelige informatie bevatten. Daarom is
            veiligheid geen bijzaak — het is de fundering van alles wat wij bouwen.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-8 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600/30 transition-colors">
                {p.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Trust badge strip */}
        <div className="border-t border-slate-800 pt-10">
          <div className="flex flex-wrap justify-center gap-3">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium px-4 py-2 rounded-full"
              >
                <BadgeCheck className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                {badge}
              </span>
            ))}
          </div>
          <p className="text-center text-slate-600 text-xs mt-6">
            Vragen over onze beveiligingsarchitectuur?{" "}
            <a
              href="mailto:security@contractscan.ai"
              className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              Neem contact op met ons security team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
