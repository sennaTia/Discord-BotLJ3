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

client.once('ready', () => {
  console.log(`Bot is ingelogd als ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'help') {
    await interaction.reply(
      '**Spelregels en Beschikbare Commando\'s:**\n\n' +
      '**Spelregels:**\n' +
      '• Tel om en om door in het kanaal.\n' +
      '• Je mag niet twee keer achter elkaar tellen.\n' +
      '• Als iemand een fout maakt, verbreekt de reeks!\n\n' +
      '**Beschikbare Commando\'s:**\n' +
      '• `/help` - Bekijk de spelregels en uitleg.\n' +
      '• `/guilty` - Bekijk wie de reeksen verbreekt.\n' +
      '• `/pr` - Bekijk het telrecord van de server.'
    );
  }
});

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

    // GUILTY COMMANDO
    if (interaction.commandName === "guilty") {
      const laatste = data.lastBreakerId ? `<@${data.lastBreakerId}>` : "Nog niemand";
      const record = data.prBreakerId ? `<@${data.prBreakerId}>` : "Nog niemand";

      antwoord =
        `❌ **Laatste reeks verbroken door:** ${laatste}\n` +
        `🏆 **Recordreeks verbroken door:** ${record}`;
    }
    // PR COMMANDO
    if (interaction.commandName === "pr") {
      const record = data.pr || 0;

      antwoord = `🏆 **Het huidige telrecord is:** ${record}`;
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

let laatsteTellerId = null;
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.channelId !== process.env.COUNT_CHANNEL_ID) return;

  try {
    const data = leesData();
    const volgende = data.currentScore + 1;
    const juist = message.content.trim() === String(volgende);
    const zelfdeGebruiker = message.author.id === laatsteTellerId;
    const geldig = juist && !zelfdeGebruiker;

    if (geldig) {
      data.currentScore = volgende;
      laatsteTellerId = message.author.id;

      if (volgende > data.pr) {
        data.pr = volgende;
      }
    } else {
      if (data.currentScore === data.pr && data.pr >= 0) {
        data.prBreakerId = message.author.id;
      }

      data.lastBreakerId = message.author.id;
      data.currentScore = 0;
      laatsteTellerId = null;
    }
    slaDataOp(data);

    if (geldig) {
      await message.reply({
        content: `✅ ${volgende}`,
        allowedMentions: { repliedUser: false }
      });

      if (volgende > 0 && volgende % 100 === 0) {
        const tekst = `Gefeliciteerd! ${volgende} bereikt!`;

        if (GIF_URL) {
          await message.channel.send(`${tekst}\n${GIF_URL}`);
        } else {
          await message.channel.send(tekst);
        }
      }
    } else {
      await message.reply({
        content: zelfdeGebruiker
          ? "❌ Je mag niet twee keer achter elkaar tellen! We beginnen opnieuw bij 1."
          : "❌ Verkeerd getal! We beginnen opnieuw bij 1.",
      });
    }
  } catch (error) {
    console.error("Fout bij tellen:", error);
  }
});


client.login(process.env.DISCORD_TOKEN);

