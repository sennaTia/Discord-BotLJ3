
const { Client, Events, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

// Bestanden en instellingen
const DATA_FILE = path.join(__dirname, "data.json");
const GIF_URL = process.env.GIF_URL;

// Verbinding met Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// JSON-gegevens lezen
function leesData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// JSON-gegevens veilig wegschrijven via tijdelijk bestand
function slaDataOp(data) {
  const tijdelijk = DATA_FILE + ".tmp";
  fs.writeFileSync(tijdelijk, JSON.stringify(data, null, 2));
  fs.renameSync(tijdelijk, DATA_FILE);
}

// Start de bot
client.login(process.env.DISCORD_TOKEN);
