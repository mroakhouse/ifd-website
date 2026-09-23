# GPT-6 Astra Agent Configurations

Denne filen setter rammene for hvordan GPT-6 Astra skal operere i dette prosjektet. Den hindrer overtenking, sikrer budsjettet og setter klare sikkerhetsgrenser.

## 🤖 Modell- og Kostnadsstyring
* **Hovedregel:** Bruk kun dyp resonnering (Astra) på komplekse arkitekturvalg, refaktorering av kjernekomponenter eller vanskelig feilsøking.
* **Delegering:** Flytt enklere oppgaver (som dokumentasjon, enhetstesting (unit tests) og standard HTML/CSS/skripting) til **GPT-6 Sol** eller **Luna** for å spare kvote og redusere responstid.
* **Tenke-tokens:** Avbryt resonneringen hvis en logisk løsning oppnås. Ikke kjør sekundære optimaliseringer med mindre brukeren ber om det spesifikt.

## 🛑 Sikkerhetsgrenser og Tillatelser
* **Sandkasse:** Du har kun tillatelse til å opprette, lese og skrive filer i prosjektets rotmappe og undermapper. Aldri rør eksterne systemfiler eller globale databaser.
* **Testmiljø:** Autonome tester skal kun kjøres i det lokale virtuelle miljøet (`/env` eller `/node_modules`).
* **Produksjon:** Du har *ikke* lov til å pushe endringer direkte til produksjon eller slette `.env`-filer uten eksplisitt bekreftelse fra brukeren.

## 🧪 Definerte Arbeidsflyter (Skills)
* **Koding & Testing:**
  1. Skriv kode for den forespurte modulen.
  2. Opprett en lokal testfil.
  3. Kjør testen én gang. Hvis testen passerer, **stopp oppgaven og presenter resultatet**. Ikke overanalyser alternative løsninger.
* **Feilsøking:** Hvis en test feiler, har du lov til å gjøre *to* autonome fikse-forsøk. Dersom det fremdeles feiler etter to forsøk, stopp og spør brukeren om retning i stedet for å brenne tokens i en evig løkke.
