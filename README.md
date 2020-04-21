# COVID-19-simulation
A agent-based model of COVID-19 spread. Created for use in Statistics and Simulation course at NTNU

## Project Description

**Oblig 5 – Simulering av Corona-utbruddet**
*IR201812 Statistikk og Simulering*

**Del I: Reprodusere scenarioene i Washington Post-artikkelen**
Utgangspunktet for prosjektet blir denne artikkelen i Washington Post:
[https://www.washingtonpost.com/graphics/2020/world/corona-simulator/](Corona simulator)
I artikkelen anvendes SIR-modellen (susceptible-infectuous-recovered) for å
skissere et svært forenklet bilde av virkeligheten, men som gir mye innsikt i
noen essensielle egenskaper av spredningsforløpet.
En intro om bl.a. SIR-modeller:
[https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology](intro)
Vi skal ikke bruke den samme modellen som i Washington Post-artikkelen,
men vi bruker rasterbasert simulering (enten av agenter som beveger seg på
et rutenett, eller en cellular automaton). I Wikipedia-artikkelen over vises en
slik rasterbasert simulering av en SIR-model.
Mål
1. Målet i del I er å reprodusere scenarioene fra Washington Postartikkelen. I den første scenarioen (fri mobilitet) skal du først tilpasse
sannsynligheten for at en smittsom person smitter en tilfeldig frisk
person slik at hver smittsom person i begynnelsen av simuleringen
(den eksponentielle fasen) smitter ca. 2,5 andre personer, som er
omtrent rapportert verdi for Corona (som egentlig er avhengig av
mange andre variabler).
2. Får du et liknende oppførsel av antall friske/smittsomme/resistente
personer som funksjon av tid, som i Washington Post-artikkelen for de
fire scenarioene?
3. Om du skalerer opp antallet personer (og arealet proporsjonalt), hva
blir antallene for den totale befolkningen til et fantasi-land med for
eksempel 100 000 innbyggere?

**Del II: Simulering av antall dødsfall.**
1. Gjenta først de fire scenarioene fra Del I, med som eneste forskjell at
du legger til en fast sannsynlighet for at en syk individ dør av viruset.
2. Hvor stor andel av innbyggerne i fantasi-landet dør av viruset i de fire
scenarioene?

**Del III: Effekten av alder**
1. Det har vært klart at alder spiller en viktig rolle i hvor alvorlig effekten
av viruset er. Vi legger derfor til alder som en parameter i modellen.
2. Legg til en aldersfordeling av individene i simuleringen. Du kan for
eksempel bruke kategorier 0-9 år, 10-19 år osv, og du kan velge å
bruke data om aldersfordelingen fra et land som finnes.
3. Legg til dødelighet som funksjon av alder i modellen.
4. Simuler forskjellige scenarioer der mobilitet er en funksjon av alder. For
eksempel:
- Alle er i karantene
- Full mobilitet
- Alle over 70 år er i karantene (slik at de har mer begrenset
kontakt med andre).
- Flere scenarioer som du selv kan velge. Du kan tenke på
effekter som tidspunktet etter der tiltak blir tatt, stengte
barnehager/skoler/høyskoler/universiteter, isolasjon av
personer som muligens er smittefarlige, begrensing av
offentlige samlinger, begrenset kontakt mellom spesifikke
aldersgrupper.
5. Hvordan varierer andel individer som dør som funksjon av hvilke
aldersgrupper som er i karantene?
6. Hvordan er antall dødsfeller som funksjon av alder i de forskjellige
scenarioene?

**Del IV: Tilbake til vanlig – scenarioer**
I denne delen simulerer vi hva som skjer om situasjonen går tilbake til vanlig
(uten karantene) etter en fast tid, for eksempel etter et halvt år. Etter det ser vi
på konsekvensen av nye infeksjoner. Vi sammenlikner de forskjellige
scenarioene som du har simulert i del III. Vi er interessert i i hvor stor grad
befolkningen (som helhet) har blitt resistent mot spredning av viruset.
Utgangspunktet er at, om nok personer har blitt resistente, en smittet person
ikke fører til et stort utbrudd. Det vi sammenlikner er det totale antallet
dødsfeller etter lang tid (inkl. forskjellige karantene-scenarioer i starten av
simuleringen).
