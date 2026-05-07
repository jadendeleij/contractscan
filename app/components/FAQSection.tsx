"use client";

import { useState } from "react";
import { Plus, Minus, ShieldCheck, ExternalLink } from "lucide-react";

function TechLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-700 underline decoration-dotted underline-offset-2 font-medium transition-colors group/tl"
    >
      {children}
      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50 group-hover/tl:opacity-100 transition-opacity" />
    </a>
  );
}

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
        kopieën, geen back-ups en loggen de inhoud van uw documenten niet. Dit is vastgelegd in ons{" "}
        <TechLink href="https://gdpr.eu/article-5-how-to-process-personal-data/">
          zero-retention beleid
        </TechLink>
        , conform{" "}
        <TechLink href="https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg">
          AVG-artikel 5 (opslagbeperking)
        </TechLink>
        .
      </>
    ),
  },
  {
    tag: "privacy",
    question: "Worden mijn documenten gebruikt om de AI te trainen?",
    answer: (
      <>
        Absoluut niet. Uw documenten worden <strong>nooit</strong> gebruikt voor training,
        fine-tuning of verbetering van onze modellen — ook niet in geanonimiseerde vorm. Wat u
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
        geautomatiseerd door onze AI. Medewerkers hebben geen toegang tot documentinhoud — dit
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
        uw recht op vergetelheid onder de{" "}
        <TechLink href="https://gdpr.eu/right-to-be-forgotten/">
          AVG artikel 17
        </TechLink>
        . U ontvangt een bevestiging per e-mail zodra de verwijdering is voltooid.
      </>
    ),
  },

  /* ── Beveiliging ── */
  {
    tag: "security",
    question: "Welke versleuteling gebruiken jullie?",
    answer: (
      <>
        Alle dataverbindingen zijn beveiligd met{" "}
        <TechLink href="https://en.wikipedia.org/wiki/Transport_Layer_Security">
          TLS 1.3
        </TechLink>
        , het modernste transportprotocol beschikbaar. Tijdelijke opslag tijdens de analyse
        is versleuteld met{" "}
        <TechLink href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard">
          AES-256
        </TechLink>{" "}
        — hetzelfde versleutelingsniveau dat internationale banken en overheidsinstellingen
        gebruiken voor hun meest gevoelige data.
      </>
    ),
  },
  {
    tag: "security",
    question: "Waar staan jullie servers? Verlaat mijn data de EU?",
    answer: (
      <>
        Al onze infrastructuur staat in <strong>Nederland en Duitsland</strong>. Uw data
        verlaat de Europese Unie nooit. Wij zijn volledig compliant met de{" "}
        <TechLink href="https://gdpr.eu/">GDPR</TechLink> en de Nederlandse{" "}
        <TechLink href="https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg">
          AVG
        </TechLink>
        . Er worden geen sub-processors buiten de EU ingezet.
      </>
    ),
  },
  {
    tag: "security",
    question: "Is het veilig om een vertrouwelijk of juridisch bindend contract te uploaden?",
    answer: (
      <>
        Ja. ContractScan AI is specifiek gebouwd voor gevoelige documenten. Onze{" "}
        <TechLink href="https://en.wikipedia.org/wiki/End-to-end_encryption">
          end-to-end versleuteling
        </TechLink>{" "}
        zorgt ervoor dat zelfs onze eigen medewerkers geen inzage hebben in uw documentinhoud.
        U kunt gerust NDA&apos;s, arbeidscontracten, leveranciersovereenkomsten en andere
        vertrouwelijke stukken uploaden.
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
        <strong>platte tekst</strong>. De maximale bestandsgrootte is 50 MB. Op het Solo- en
        Pro-abonnement worden documenten tot respectievelijk 100 en onbeperkt pagina&apos;s
        verwerkt.
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
            Alles wat u wilt weten<br />over privacy & veiligheid
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
                      <span
                        className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${tagColors[faq.tag]}`}
                      >
                        {tagLabels[faq.tag]}
                      </span>
                    )}
                    <span className={`font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors ${isOpen ? "text-blue-700" : ""}`}>
                      {faq.question}
                    </span>
                  </div>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors mt-0.5 ${isOpen ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"}`}>
                    {isOpen
                      ? <Minus className="w-3.5 h-3.5" />
                      : <Plus className="w-3.5 h-3.5" />
                    }
                  </span>
                </button>

                {/* Accordion body — grid trick for smooth animation */}
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
