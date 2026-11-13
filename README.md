# Discord Counting Bot

Een Discord-bot waarmee gebruikers samen kunnen tellen. De bot houdt de huidige score bij, slaat het hoogste record op en registreert wie een telreeks heeft verbroken.

## Benodigdheden

Om deze bot te gebruiken, heb je het volgende nodig:

- **Node.js** om JavaScript uit te voeren.
- **Visual Studio Code** om de code te bekijken en uit te voeren.
- **discord.js** om de bot met Discord te laten communiceren.
- **Een Discord-bot-token** uit het Discord Developer Portal.

## Installatie

### Stap 1: Download het project

Download de bestanden vanaf GitHub via **Code → Download ZIP** of clone de repository.

Pak het ZIP-bestand uit en open de projectmap in Visual Studio Code.

### Stap 2: Installeer de benodigde onderdelen

Zorg dat Node.js op je computer is geïnstalleerd.

Open vervolgens de terminal in Visual Studio Code en voer dit commando uit:

```bash
npm install
```

Hiermee worden de benodigde pakketten, waaronder discord.js, geïnstalleerd.

### Stap 3: Maak een .env-bestand aan

**Belangrijk:** De bot werkt niet direct wanneer je hem van GitHub downloadt.

Dit komt doordat het bestand `.env` niet wordt meegestuurd naar GitHub. Dit bestand bevat geheime gegevens, waaronder het Discord-bot-token. Om veiligheidsredenen staat `.env` in `.gitignore`, zodat deze gegevens niet openbaar worden.

Je moet daarom zelf een bestand met de naam `.env` aanmaken in de hoofdmap van het project.

Zet hierin de volgende gegevens:

```env
DISCORD_TOKEN=JOUW_BOT_TOKEN
GUILD_ID=JOUW_SERVER_ID
COUNT_CHANNEL_ID=JOUW_COUNTING_KANAAL_ID
GIF_URL=JOUW_GIF_LINK
```

Vervang de voorbeeldwaarden door je eigen gegevens.

Je kunt een Discord-bot aanmaken en het token ophalen via het [Discord Developer Portal](https://discord.com/developers/applications).

Daarnaast moet de bot aan je Discord-server zijn toegevoegd en moet **Message Content Intent** ingeschakeld zijn in het Developer Portal.

**Deel je bot-token nooit met anderen en upload je `.env`-bestand niet naar GitHub.**

### Stap 4: Controleer data.json

De bot gebruikt het bestand `data.json` om de huidige score, het record en de gebruikers die reeksen hebben verbroken op te slaan.

Als dit bestand ontbreekt, maak je zelf `data.json` aan met de volgende inhoud:

```json
{
  "currentScore": 0,
  "pr": 0,
  "lastBreakerId": null,
  "prBreakerId": null
}
```

Hiermee begint de bot bij het getal 1.

## De bot starten

Open de terminal in Visual Studio Code en voer het volgende commando uit:

```bash
node --env-file=.env index.js
```

Als alles goed is ingesteld, wordt de bot online weergegeven in Discord en kun je hem gebruiken in het ingestelde counting-kanaal.

## De bot stoppen

Om de bot uit te zetten, druk je in de terminal op:

**Ctrl + C**

Als je Visual Studio Code afsluit of je computer uitzet, stopt de bot normaal gesproken ook.

De bot draait namelijk lokaal op je eigen computer en blijft niet automatisch 24/7 online.

Om de bot opnieuw te starten, voer je hetzelfde commando uit:

```bash
node --env-file=.env index.js
```

De opgeslagen gegevens in `data.json` blijven behouden, zolang het bestand niet wordt verwijderd of aangepast.

## Mogelijke problemen

| Probleem | Mogelijke oorzaak |
|---|---|
| De bot gaat niet online | Het `.env`-bestand ontbreekt of het token is onjuist. |
| `Cannot find module 'discord.js'` | Voer `npm install` uit. |
| De bot reageert niet op getallen | Controleer de kanaal-ID en Message Content Intent. |
| De commando's werken niet | Controleer de server-ID en of de bot correct is geïnstalleerd. |
| Er verschijnt een fout over `data.json` | Controleer of het bestand bestaat en geldige JSON bevat. |
| De bot gaat offline | De terminal of computer waarop de bot draait is afgesloten. |

## Belangrijk

Deze bot is gemaakt met **JavaScript, Node.js en discord.js**.

De gegevens worden lokaal opgeslagen in een JSON-bestand. Hierdoor is er geen externe database nodig.

Omdat `.env` niet via GitHub wordt gedeeld, moet iedere gebruiker die de bot zelf wil uitvoeren de benodigde instellingen en een geldig Discord-bot-token toevoegen.