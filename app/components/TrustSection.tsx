import { Lock, ShieldCheck, Trash2, Globe, ExternalLink, BadgeCheck } from "lucide-react";

function TechLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-2 font-semibold transition-colors group/tl"
    >
      {children}
      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50 group-hover/tl:opacity-100 transition-opacity" />
    </a>
  );
}

const pillars = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Versleuteld tijdens overdracht",
    body: (
      <>
        Elke verbinding is beveiligd met{" "}
        <TechLink href="https://en.wikipedia.org/wiki/Transport_Layer_Security">
          TLS 1.3
        </TechLink>
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
        <TechLink href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard">
          AES-256-encryptie
        </TechLink>{" "}
        — hetzelfde standaard dat banken en overheden wereldwijd gebruiken voor
        hun meest gevoelige bestanden.
      </>
    ),
  },
  {
    icon: <Trash2 className="w-6 h-6" />,
    title: "Automatisch verwijderd na analyse",
    body: (
      <>
        Zodra uw rapport klaar is, wordt het originele document{" "}
        <TechLink href="https://gdpr.eu/article-5-how-to-process-personal-data/">
          permanent gewist
        </TechLink>{" "}
        van onze servers. Wij hanteren een strict{" "}
        <span className="text-slate-300 font-medium">zero-retention beleid</span>:
        geen archief, geen back-up, geen logging van inhoud.
      </>
    ),
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "EU-servers & AVG-compliant",
    body: (
      <>
        Al onze infrastructuur staat in Nederland en Duitsland — binnen de{" "}
        <TechLink href="https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg">
          AVG
        </TechLink>{" "}
        (Europese privacywetgeving). Uw data verlaat de EU nooit. Wij zijn
        volledig compliant met de{" "}
        <TechLink href="https://gdpr.eu/">
          GDPR
        </TechLink>
        .
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
