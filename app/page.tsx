export const dynamic = "force-dynamic";

import {
  ArrowRight,
  Info,
  Star,
  Upload,
  ScanText,
  FileCheck,
  Clock,
  ShieldCheck,
  Zap,
  Check,
  X,
  Sparkles,
  Users,
  Infinity,
} from "lucide-react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrustSection from "./components/TrustSection";
import FAQSection from "./components/FAQSection";
import BlogSection from "./components/BlogSection";
import ScheduledMaintenanceBanner from "./components/ScheduledMaintenanceBanner";
import { Suspense } from "react";

/* ── DATA ─────────────────────────────────────── */

const steps = [
  {
    number: "01",
    icon: <Upload className="w-7 h-7" />,
    title: "Upload je contract",
    description: "Sleep een PDF of Word-bestand naar het uploadvak, of plak de tekst direct in het veld.",
    gradient: "from-blue-50 to-indigo-100",
    iconBg: "bg-blue-600",
    gifFile: "upload-demo.gif",
  },
  {
    number: "02",
    icon: <ScanText className="w-7 h-7" />,
    title: "AI analyseert de inhoud",
    description: "Onze AI scant elke clausule en markeert risico's, verplichtingen en afwijkingen van de norm.",
    gradient: "from-violet-50 to-purple-100",
    iconBg: "bg-violet-600",
    gifFile: "analyse-demo.gif",
  },
  {
    number: "03",
    icon: <FileCheck className="w-7 h-7" />,
    title: "Ontvang je rapport",
    description: "Bekijk een helder overzicht met een risicoscore, uitleg in gewone taal en concrete aanbevelingen.",
    gradient: "from-emerald-50 to-teal-100",
    iconBg: "bg-emerald-600",
    gifFile: "rapport-demo.gif",
  },
];

const benefits = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "60 seconden",
    description: "Van upload naar volledig rapport in minder dan een minuut.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Veilig & privé",
    description: "AES-256 versleuteld, automatisch verwijderd, EU-servers. Uw documenten blijven van u.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Nauwkeurig",
    description: "Getraind op duizenden contracten. Gevalideerd door juridische experts.",
  },
];

/* ── PRICING DATA ─────────────────────────────── */

type FeatureValue = boolean | string;

type PlanFeature = {
  label: string;
  key?: boolean;
  free: FeatureValue;
  solo: FeatureValue;
  pro: FeatureValue;
};

const planFeatures: PlanFeature[] = [
  { label: "Scans per maand",                   key: true,  free: "1×",         solo: "Onbeperkt",  pro: "Onbeperkt"   },
  { label: "Max. pagina's per document",                     free: "3 pag.",     solo: "100 pag.",   pro: "Onbeperkt"   },
  { label: "Risicoscore & samenvatting",                     free: true,         solo: true,         pro: true          },
  { label: "Volledige clausule-uitleg",          key: true,  free: false,        solo: true,         pro: true          },
  { label: "PDF-rapport downloaden",             key: true,  free: false,        solo: true,         pro: true          },
  { label: "Opgeslagen rapporten",               key: true,  free: false,        solo: "12 maanden", pro: "Onbeperkt"   },
  { label: "Directe verwerking (geen wachtrij)", key: true,  free: false,        solo: true,         pro: true          },
  { label: "Teamleden",                          key: true,  free: false,        solo: false,        pro: "Tot 5 users" },
  { label: "API-koppeling",                      key: true,  free: false,        solo: false,        pro: true          },
  { label: "AVG-compliance rapport",                         free: false,        solo: false,        pro: true          },
  { label: "Contractvergelijking",                           free: false,        solo: false,        pro: true          },
  { label: "Support",                                        free: "Community",  solo: "E-mail",     pro: "Prioriteit <4u" },
];

type PlanCardFeature = { label: string; key?: boolean };

type Plan = {
  id: string;
  name: string;
  price: number | null;
  description: string;
  valueProp: string;
  cta: string;
  highlight: boolean;
  badge: string | null;
  badgeColor: string;
  features: PlanCardFeature[];
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: null,
    description: "Probeer het vrijblijvend",
    valueProp: "Ideaal om de tool te ontdekken",
    cta: "Start gratis",
    highlight: false,
    badge: null,
    badgeColor: "",
    features: [
      { label: "1 scan per maand" },
      { label: "Risicoscore & samenvatting" },
      { label: "Max. 3 pagina's per document" },
    ],
  },
  {
    id: "solo",
    name: "Solo",
    price: 29,
    description: "Voor ZZP'ers & freelancers",
    valueProp: "Bespaar gemiddeld 3 uur per contract",
    cta: "Kies Solo, start direct",
    highlight: true,
    badge: "Meest gekozen",
    badgeColor: "bg-amber-400 text-amber-900",
    features: [
      { label: "Onbeperkt scannen", key: true },
      { label: "Volledige clausule-uitleg", key: true },
      { label: "PDF-rapport downloaden", key: true },
      { label: "12 maanden rapportgeschiedenis" },
      { label: "Directe verwerking (geen wachtrij)" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    description: "Voor teams & MKB",
    valueProp: "Samenwerken, automatiseren, schalen",
    cta: "Kies Pro",
    highlight: false,
    badge: "Voor bedrijven",
    badgeColor: "bg-slate-700 text-slate-200",
    features: [
      { label: "Alles van Solo" },
      { label: "Tot 5 teamleden", key: true },
      { label: "API-koppeling", key: true },
      { label: "AVG-compliance rapport", key: true },
      { label: "Prioriteit support (<4u)" },
    ],
  },
];

/* ── SUB-COMPONENTS ───────────────────────────── */

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === false) return <X className="w-4 h-4 text-slate-300 mx-auto" />;
  if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  return <span className="text-xs font-semibold text-slate-700">{value}</span>;
}

function CardFeatureItem({ label, isKey, dark }: { label: string; isKey?: boolean; dark: boolean }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${dark ? "text-blue-100" : "text-slate-600"}`}>
      <Check className={`w-4 h-4 flex-shrink-0 ${isKey ? (dark ? "text-amber-300" : "text-amber-500") : (dark ? "text-blue-200" : "text-green-500")}`} />
      <span className={isKey ? "font-semibold" : ""}>{label}</span>
      {isKey && (
        <Sparkles className={`w-3 h-3 flex-shrink-0 ${dark ? "text-amber-300" : "text-amber-400"}`} />
      )}
    </li>
  );
}

/* ── PAGE ─────────────────────────────────────── */

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      <Suspense fallback={null}>
        <ScheduledMaintenanceBanner />
      </Suspense>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="pt-32 pb-12 sm:pb-28 px-6 text-center bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            AI-gedreven contractanalyse
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
            Stop met gokken<br />
            <span className="text-blue-600">op je contracten.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            ContractScan AI leest elk contract voor je uit, markeert verborgen risico&apos;s en legt alles uit in gewone taal. Zodat jij met vertrouwen tekent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300">
              Scan gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#hoe-het-werkt" className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-8 py-4 rounded-xl text-lg transition-all">
              <Info className="w-5 h-5" />
              Meer info
            </a>
          </div>

          {/* Social proof */}
          <div className="w-full max-w-lg mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm divide-x divide-slate-100 grid grid-cols-3">
            <div className="flex flex-col items-center gap-1 px-4 py-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">4,8 / 5</span>
              <span className="text-[10px] sm:text-xs text-slate-400 text-center leading-tight">1.240 reviews</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 px-4 py-4">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">3.800+</span>
              <span className="text-[10px] sm:text-xs text-slate-500 text-center leading-tight">ZZP&apos;ers actief</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 px-4 py-4">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">640+</span>
              <span className="text-[10px] sm:text-xs text-slate-500 text-center leading-tight">MKB-bedrijven</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOE HET WERKT (GIF-sectie) ────────────────── */}
      <section id="hoe-het-werkt" className="py-12 md:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Hoe het werkt</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Drie stappen. Geen juridische kennis vereist.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group flex flex-col rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visueel blok — vervang door <img src={`/gifs/${step.gifFile}`} ... /> zodra GIFs klaar zijn */}
                <div className={`bg-gradient-to-br ${step.gradient} aspect-video flex flex-col items-center justify-center gap-4 relative overflow-hidden`}>
                  {/* Decoratieve cirkels op achtergrond */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20" />
                  <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/20" />

                  <div className={`relative z-10 w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-slate-400">
                    Stap {step.number}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VOORDELEN ─────────────────────────────────── */}
      <section id="voordelen" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Waarom ContractScan AI?</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Snel, veilig en begrijpelijk.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                  {b.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERTROUWEN & VEILIGHEID ────────────────────── */}
      <TrustSection />

      {/* ── PRICING ───────────────────────────────────── */}
      <section id="prijzen" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Transparante prijzen</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Begin gratis. Schaal op zodra je meer nodig hebt.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-start">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border transition-all duration-200 ${
                  plan.highlight
                    ? "border-blue-500 bg-blue-600 shadow-2xl shadow-blue-200 md:-translate-y-3"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg"
                }`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                )}

                <div className="p-8 pb-6">
                  {/* Name + desc */}
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-1 ${plan.highlight ? "text-blue-200" : "text-slate-500"}`}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-5 mb-2 flex items-end gap-1">
                    {plan.price ? (
                      <>
                        <span className={`text-5xl font-extrabold leading-none ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                          €{plan.price}
                        </span>
                        <span className={`text-sm mb-1 ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>
                          / maand
                        </span>
                      </>
                    ) : (
                      <span className={`text-5xl font-extrabold leading-none ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                        Gratis
                      </span>
                    )}
                  </div>

                  {/* Value prop */}
                  <p className={`text-xs font-medium mb-6 ${plan.highlight ? "text-amber-300" : "text-slate-400"}`}>
                    {plan.valueProp}
                  </p>

                  {/* CTA */}
                  <Link
                    href={plan.id !== "free" ? `/register?plan=${plan.id}` : "/register"}
                    className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition-all active:scale-95 ${
                      plan.highlight
                        ? "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                        : plan.id === "free"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

                {/* Feature list */}
                <div className={`px-8 pb-8 border-t ${plan.highlight ? "border-blue-500" : "border-slate-100"}`}>
                  <ul className="mt-6 flex flex-col gap-3">
                    {plan.id === "free" && (
                      <li className="flex items-center gap-2 text-sm text-slate-400 italic">
                        <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        Geen clausule-uitleg
                      </li>
                    )}
                    {plan.features.map((f) => (
                      <CardFeatureItem
                        key={f.label}
                        label={f.label}
                        isKey={f.key}
                        dark={plan.highlight}
                      />
                    ))}
                    {plan.id === "free" && (
                      <>
                        <li className="flex items-center gap-2 text-sm text-slate-400 italic">
                          <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          Geen PDF-rapport
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-400 italic">
                          <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          Geen contractgeschiedenis
                        </li>
                      </>
                    )}
                    {plan.id === "solo" && (
                      <li className="flex items-center gap-2 text-sm text-blue-200 italic">
                        <X className="w-4 h-4 text-blue-400/50 flex-shrink-0" />
                        Geen teamleden of API
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Feature comparison table — desktop only */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100 shadow-sm mt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 font-semibold text-slate-700 w-2/5">Functie</th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className={`px-4 py-4 font-bold text-center ${p.highlight ? "text-blue-600" : "text-slate-700"}`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planFeatures.map((f, i) => (
                  <tr
                    key={f.label}
                    className={`border-b border-slate-50 transition-colors hover:bg-slate-50/80 ${
                      f.key ? "bg-amber-50/40" : i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    <td className="px-6 py-3.5 text-slate-700 flex items-center gap-2">
                      {f.key && <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      <span className={f.key ? "font-semibold text-slate-800" : ""}>{f.label}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <FeatureCell value={f.free} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <FeatureCell value={f.solo} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <FeatureCell value={f.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table legend — desktop only */}
          <div className="hidden md:flex items-center justify-between mt-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Onmisbare functies voor professionals</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Infinity className="w-3.5 h-3.5" /> = onbeperkt
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> = teamfunctie
              </span>
              <span>Alle prijzen excl. btw · Maandelijks opzegbaar</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <FAQSection />

      {/* ── BLOG SECTIE ───────────────────────────────── */}
      <Suspense fallback={null}>
        <BlogSection />
      </Suspense>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Klaar om slimmer te ondertekenen?
          </h2>
          <p className="text-blue-100 text-lg mb-8">Begin vandaag gratis. Geen creditcard, geen gedoe.</p>
          <Link href="/register" className="group inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg active:scale-95">
            Start gratis scan
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
