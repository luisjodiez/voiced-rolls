// Register module settings during initialization
Hooks.once('init', () => {
  game.settings.register("voiced-rolls", "language", {
    name: "Speech Language",
    hint: "The language to use for speech synthesis (e.g., 'en', 'es').",
    scope: "client", // Each user can set their own value
    config: true, // Show in the settings menu
    type: String,
    default: "es"
  });

  game.settings.register("voiced-rolls", "rate", {
    name: "Speech Rate",
    hint: "The rate of speech synthesis (e.g., 1.0 for normal speed).",
    scope: "client",
    config: true,
    type: Number,
    default: 1.5
  });
});

// List of valid languages for speech synthesis
const validLanguages = ["en", "es", "fr", "de", "it", "ja", "ko", "zh", "ru", "pt"];

// Function to check if a language is valid
function isValidLanguage(language) {
  return validLanguages.includes(language);
}

Hooks.on('diceSoNiceRollStart', (nulo, doc) => {
  let faces = 0; // Dice number of faces
  let group_score = 0; // Score for the die grouped by faces
  let group_text = ""; // List of individual rolls for a group

  // Fetch user-configured settings dynamically
  const language = game.settings.get("voiced-rolls", "language");
  const rate = game.settings.get("voiced-rolls", "rate");

  // Validate settings dynamically
  const validatedLanguage = isValidLanguage(language) ? language : "es";
  const validatedRate = typeof rate === "number" && rate >= 0.1 && rate <= 10 ? rate : 1.5;

  if (language !== validatedLanguage) {
    ui.notifications.warn("Invalid language setting. Falling back to default: 'es'.");
    game.settings.set("voiced-rolls", "language", validatedLanguage);
  }

  if (rate !== validatedRate) {
    ui.notifications.warn(`Invalid rate setting. Falling back to default: ${validatedRate}.`);
    game.settings.set("voiced-rolls", "rate", validatedRate);
  }

  // Function to create and speak a message
  function speakMessage(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = validatedLanguage;
    msg.rate = validatedRate;
    window.speechSynthesis.speak(msg);
  }

  // Iterate and parse individual rolls
  function parseTerms(term) {
    if (term.faces) {
      faces = term.faces;
      if (term.values.length > 1) {
        term.values.forEach(parseIndividualRoll);
      }
    }
  }

  // Iterate and parse the full roll
  function parseRolls(roll) {
    if (!roll || !roll.terms) return; // Error handling for undefined roll
    roll.terms.forEach(parseTerms);
    speakMessage("Total: " + roll.total);
  }

  // Parse each dice roll and process grouped output
  function parseIndividualRoll(item, index, arr) {
    group_score += item;
    group_text += item;
    if (index + 1 === arr.length) {
      speakMessage("Tirada individual: " + group_text + ".");
      group_score = 0;
      group_text = "";
    } else {
      group_text += ", ";
    }
  }

  // Start the calls
  if (doc && doc.roll) {
    parseRolls(doc.roll);
  }
});
