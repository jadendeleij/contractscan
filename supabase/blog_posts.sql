CREATE TABLE IF NOT EXISTS public.blog_posts (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT        UNIQUE NOT NULL,
  title       TEXT        NOT NULL,
  excerpt     TEXT        NOT NULL DEFAULT '',
  content     TEXT        NOT NULL DEFAULT '',
  category    TEXT        NOT NULL DEFAULT 'Beveiliging',
  published   BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone (incl. anonymous) can read published posts
CREATE POLICY "public_read_published" ON public.blog_posts
  FOR SELECT USING (published = true);

-- Placeholder blog posts (published so the blog pages work immediately)
INSERT INTO public.blog_posts (slug, title, excerpt, content, category, published) VALUES
(
  'wat-is-tls-encryptie',
  'Wat is TLS 1.3 encryptie?',
  'TLS 1.3 is het modernste beveiligingsprotocol voor internetverbindingen. We leggen uit hoe het werkt en waarom het belangrijk is voor de vertrouwelijkheid van uw contracten.',
  'TLS staat voor Transport Layer Security en is het protocol dat zorgt voor een versleutelde verbinding tussen uw browser en een webserver.

Stel je voor dat je een brief verstuurt via de post. Zonder envelop kan iedereen meelezen. TLS is die envelop — maar dan voor data die via het internet reist.

Versie 1.3, uitgebracht in 2018, is de modernste en veiligste variant. Oudere versies (TLS 1.0 en 1.1) hadden bekende kwetsbaarheden die inmiddels zijn gedicht. Versie 1.3 verwijdert ook verouderde cryptografische algoritmes en maakt de verbinding sneller op te zetten.

Bij ContractScan AI is elke verbinding beveiligd met TLS 1.3. Dit betekent dat uw document — van het moment dat u op "Uploaden" klikt tot het moment dat u uw rapport ontvangt — nooit leesbaar is voor derden, zelfs niet voor internetproviders of tussenliggende servers.',
  'Beveiliging',
  true
),
(
  'wat-is-aes-256-encryptie',
  'Wat is AES-256 encryptie?',
  'AES-256 is de wereldstandaard voor het versleutelen van opgeslagen data. Banken, overheden en legerorganisaties wereldwijd vertrouwen op dit algoritme.',
  'AES staat voor Advanced Encryption Standard. Het is een symmetrisch encryptie-algoritme dat in 2001 door het Amerikaanse NIST werd goedgekeurd en sindsdien de mondiale standaard is geworden.

Het getal 256 verwijst naar de sleutellengte in bits. Hoe langer de sleutel, hoe moeilijker het is om de versleuteling te kraken. Met 256 bits zijn er meer mogelijke sleutels dan er atomen in het waarneembare heelal zijn — het kraken is in de praktijk onmogelijk, zelfs voor de krachtigste supercomputers.

AES-256 wordt gebruikt door banken voor online-bankieren, door overheden voor staatsgeheimen en door cloud-providers voor het beveiligen van opgeslagen bestanden. De Amerikaanse NSA heeft AES-256 goedgekeurd voor de verwerking van informatie op het hoogste geheimhoudingsniveau.

Bij ContractScan AI slaan wij uw document tijdens de analyse tijdelijk op met AES-256 encryptie. Zodra het rapport klaar is, wordt het bestand permanent gewist. U kunt er zeker van zijn dat uw contractinhoud nooit leesbaar is voor onbevoegden.',
  'Beveiliging',
  true
),
(
  'zero-retention-beleid',
  'Wat betekent een zero-retention beleid?',
  'Zero-retention betekent dat wij uw documenten nooit langer bewaren dan strikt noodzakelijk. Direct na de analyse wordt uw contract permanent van onze servers verwijderd.',
  'Zero-retention is een privacyprincipe waarbij een organisatie ervoor kiest om gegevens zo kort mogelijk te bewaren — in ons geval: alleen zo lang als de analyse duurt.

Veel clouddiensten bewaren uw bestanden standaard voor langere tijd, soms voor onbepaalde duur. Dit vergroot het risico: hoe langer data wordt opgeslagen, hoe groter de kans op een datalek, onbevoegde toegang of misbruik.

Bij ContractScan AI hanteren wij een strict zero-retention beleid:
- Uw document wordt geüpload en direct verwerkt.
- Zodra het rapport is gegenereerd, wordt het originele bestand permanent verwijderd.
- Wij bewaren geen kopieën, back-ups of logs van de contractinhoud.
- Uw rapport (de samenvatting en risico-analyse) kunt u zelf bewaren — het ruwe document niet.

Dit principe sluit aan op artikel 5 van de AVG, dat stelt dat persoonsgegevens "niet langer mogen worden bewaard dan noodzakelijk is voor de doeleinden waarvoor zij worden verwerkt".',
  'Privacy',
  true
),
(
  'avg-gdpr-uitleg',
  'AVG en GDPR: wat betekent het voor uw contracten?',
  'De AVG (ook wel GDPR) is de Europese privacywetgeving die regelt hoe bedrijven omgaan met persoonsgegevens. We leggen uit wat dit betekent voor het verwerken van contracten.',
  'AVG staat voor Algemene Verordening Gegevensbescherming. Dit is de Nederlandse naam voor de Europese wet die in het Engels General Data Protection Regulation (GDPR) heet. De verordening is van kracht sinds 25 mei 2018 en geldt voor alle organisaties die persoonsgegevens verwerken van mensen in de EU.

Contracten bevatten vrijwel altijd persoonsgegevens: namen, adressen, BSN-nummers, salarisgegevens of andere identificeerbare informatie. Dit maakt het verwerken van contracten een AVG-gevoelige activiteit.

De AVG stelt onder andere dat:
- Persoonsgegevens alleen mogen worden verwerkt voor een specifiek, omschreven doel.
- Gegevens niet langer mogen worden bewaard dan noodzakelijk.
- Passende technische maatregelen moeten worden genomen om gegevens te beschermen.
- Verwerking transparant moet zijn voor de betrokkene.

ContractScan AI is ontworpen met deze principes als uitgangspunt. Wij verwerken uw contractinhoud uitsluitend voor de analyse, slaan geen persoonsgegevens op na de verwerking en verwerken alle data op EU-servers in Nederland en Duitsland. De toezichthouder in Nederland is de Autoriteit Persoonsgegevens.',
  'Privacy',
  true
);
