
const { Client, Events, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const DATA_FILE = path.join(__dirname, "data.json");
const GIF_URL = process.env.GIF_URL;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

function leesData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function slaDataOp(data) {
  const tijdelijk = DATA_FILE + ".tmp";
  fs.writeFileSync(tijdelijk, JSON.stringify(data, null, 2));
  fs.renameSync(tijdelijk, DATA_FILE);
}

client.once(Events.ClientReady, async () => {
  console.log(`Bot online als ${client.user.tag}`);

  try {
    const server = await client.guilds.fetch(process.env.GUILD_ID);

    await server.commands.set([
      { name: "pr", description: "Bekijk het telrecord" },
      { name: "guilty", description: "Bekijk wie de reeksen verbrak" },
      { name: "help", description: "Bekijk de spelregels" }
    ]);

    console.log("Commando's geregistreerd!");
  } catch (error) {
    console.error("Fout bij registreren:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.guildId !== process.env.GUILD_ID) return;

  try {
    const data = leesData();
    let antwoord;

    if (interaction.commandName === "guilty") {
      const laatste = data.lastBreakerId
        ? `<@${data.lastBreakerId}>`
        : "Nog niemand";

      const record = data.prBreakerId
        ? `<@${data.prBreakerId}>`
        : "Nog niemand";

      antwoord =
        `❌ Laatste reeks verbroken door: ${laatste}\n` +
        `🏆 Recordreeks verbroken door: ${record}`;
    }

    if (antwoord) {
      await interaction.reply({
        content: antwoord,
        allowedMentions: { parse: [] }
      });
    }
  } catch (error) {
    console.error("Fout bij commando:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);
