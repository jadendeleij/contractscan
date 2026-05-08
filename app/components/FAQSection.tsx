"use client";

import { useState } from "react";
import { Plus, Minus, ShieldCheck } from "lucide-react";

type FAQ = { question: string; answer: React.ReactNode; tag?: "privacy" | "security" | "product" };

const faqs: FAQ[] = [
  /* ── Privacy & opslag ── */
  {
    tag: "privacy",
    question: "Worden mijn contracten opgeslagen na de analyse?",
    answer: (
      <>
        Nee, nooit. Zodra de analyse is voltooid, wordt uw document{" "}
        <strong>automatisch en permanent verwijderd</strong> van onze servers. Wij bewaren geen
        kopieën, geen back-ups en loggen de inhoud van uw documenten niet. Dit is vastgelegd in ons
        zero-retention beleid, conform AVG-artikel 5 (opslagbeperking).
      </>
    ),
  },
  {
    tag: "privacy",
    question: "Worden mijn documenten gebruikt om de AI te trainen?",
    answer: (
      <>
        Absoluut niet. Uw documenten worden <strong>nooit</strong> gebruikt voor training,
        fine-tuning of verbetering van onze modellen, ook niet in geanonimiseerde vorm. Wat u
        uploadt, blijft van u. Dit is een harde technische én contractuele beperking, geen
        marketingbelofte.
      </>
    ),
  },
  {
    tag: "privacy",
    question: "Wie heeft er toegang tot de inhoud van mijn contract?",
    answer: (
      <>
        Niemand bij ContractScan AI leest uw documenten mee. De verwerking verloopt volledig
        geautomatiseerd door onze AI. Medewerkers hebben geen toegang tot documentinhoud; dit
        is architectureel afgedwongen, niet alleen beleidsmatig.
      </>
    ),
  },
  {
    tag: "privacy",
    question: "Kan ik mijn account en alle data laten verwijderen?",
    answer: (
      <>
        Ja. U kunt op elk moment via de instellingenpagina uw account opheffen. Alle
        bijbehorende metadata wordt binnen <strong>30 dagen</strong> permanent gewist, conform
        uw recht op vergetelheid onder AVG artikel 17. U ontvangt een bevestiging per e-mail
        zodra de verwijdering is voltooid.
      </>
    ),
  },

  /* ── Beveiliging ── */
  {
    tag: "security",
    question: "Welke versleuteling gebruiken jullie?",
    answer: (
      <>
        Alle dataverbindingen zijn beveiligd met <strong>TLS 1.3</strong>, het modernste
        transportprotocol beschikbaar. Tijdelijke opslag tijdens de analyse is versleuteld met{" "}
        <strong>AES-256</strong>, hetzelfde versleutelingsniveau dat internationale banken en
        overheidsinstellingen gebruiken voor hun meest gevoelige data.
      </>
    ),
  },
  {
    tag: "security",
    question: "Waar staan jullie servers? Verlaat mijn data de EU?",
    answer: (
      <>
        Al onze infrastructuur staat in <strong>Nederland en Duitsland</strong>. Uw data
        verlaat de Europese Unie nooit. Wij zijn volledig compliant met de GDPR en de
        Nederlandse AVG. Er worden geen sub-processors buiten de EU ingezet.
      </>
    ),
  },
  {
    tag: "security",
    question: "Is het veilig om een vertrouwelijk of juridisch bindend contract te uploaden?",
    answer: (
      <>
        Ja. ContractScan AI is specifiek gebouwd voor gevoelige documenten. End-to-end
        versleuteling zorgt ervoor dat zelfs onze eigen medewerkers geen inzage hebben in uw
        documentinhoud. U kunt gerust NDA&apos;s, arbeidscontracten, leveranciersovereenkomsten
        en andere vertrouwelijke stukken uploaden.
      </>
    ),
  },

  /* ── Product ── */
  {
    tag: "product",
    question: "Welke bestandsformaten worden ondersteund?",
    answer: (
      <>
        Wij ondersteunen <strong>PDF</strong>, <strong>Word (.docx)</strong> en{" "}
        <strong>platte tekst</strong>. De maximale bestandsgrootte is 50 MB. Het gratis
        abonnement verwerkt documenten tot <strong>3 pagina&apos;s</strong>; Solo tot 100
        pagina&apos;s en Pro zonder limiet.
      </>
    ),
  },
  {
    tag: "product",
    question: "Wat wordt er precies opgeslagen na de scan?",
    answer: (
      <>
        Het originele contract wordt <strong>nooit</strong> opgeslagen. Wat wij bewaren is
        uitsluitend het <strong>AI-rapport</strong>: de risicoscore, clausule-uitleg en
        aanbevelingen. Bij het Solo-abonnement blijft dit rapport{" "}
        <strong>12 maanden</strong> beschikbaar; bij Pro <strong>onbeperkt</strong>. Op het
        gratis abonnement wordt geen rapportgeschiedenis bijgehouden.
      </>
    ),
  },
  {
    tag: "product",
    question: "Kan ik op elk moment opzeggen?",
    answer: (
      <>
        Ja, altijd. Er zijn geen langetermijnverplichtingen of opzegtermijnen. Na opzegging
        behoudt u toegang tot het einde van uw betaalde periode. Daarna worden uw gegevens
        conform ons retention-beleid verwijderd.
      </>
    ),
  },
  {
    tag: "product",
    question: "Hoe nauwkeurig is de analyse?",
    answer: (
      <>
        Ons model is getraind op tienduizenden Nederlandse en Europese contracten en gevalideerd
        door juridische experts. De analyse is bedoeld als{" "}
        <strong>professionele ondersteuning</strong>, niet als vervanging van juridisch advies.
        Bij complexe of hoogrisico-contracten raden wij altijd aan om ook een jurist te raadplegen.
      </>
    ),
  },
];

const tagLabels: Record<string, string> = {
  privacy: "Privacy",
  security: "Beveiliging",
  product: "Product",
};

const tagColors: Record<string, string> = {
  privacy: "bg-purple-100 text-purple-700",
  security: "bg-green-100 text-green-700",
  product: "bg-blue-100 text-blue-700",
};

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Veelgestelde vragen
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Alles wat u wilt weten<br />over privacy &amp; veiligheid
          </h2>
          <p className="text-slate-500 text-lg">
            Transparantie is onze standaard. Geen vaagtaal, geen kleine lettertjes.
          </p>
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-blue-200 shadow-md shadow-blue-50"
                    : "border-slate-100 hover:border-slate-200 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {faq.tag && (
                      <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${tagColors[faq.tag]}`}>
                        {tagLabels[faq.tag]}
                      </span>
                    )}
                    <span className={`font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors ${isOpen ? "text-blue-700" : ""}`}>
                      {faq.question}
                    </span>
                  </div>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors mt-0.5 ${isOpen ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"}`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {/* Accordion body */}
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Staat uw vraag er niet bij?{" "}
            <a
              href="mailto:privacy@contractscan.ai"
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors"
            >
              Stel hem direct aan ons team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
