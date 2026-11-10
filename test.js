const fs = require("fs");

const nieuweInhoud = {
  test: "Hallo Ferdigoat!",
  tijdstip: new Date().toISOString(),
  status: "gefaald",
};

fs.writeFileSync("test.json", JSON.stringify(nieuweInhoud, null, 2));

console.log("Het JSON-bestand is aangemaakt/aangepast!");

const gelezenData = fs.readFileSync("test.json", "utf8");
console.log("Inhoud van test.json:", JSON.parse(gelezenData));
