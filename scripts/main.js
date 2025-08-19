console.log("main.js loaded");

// Register module settings during initialization
Hooks.once('init', () => {
  try {
    window.voicedRolls.registerSettings();
  } catch (error) {
    console.error("Error during module initialization:", error);
  }
});

Hooks.on('diceSoNiceRollStart', (nulo, doc) => {
  let group_score = 0; // Score for the die grouped by faces
  let group_text = ""; // List of individual rolls for a group

  try {
    // Fetch user-configured settings dynamically
    const language = game.settings.get("voiced-rolls", "language");
    const rate = game.settings.get("voiced-rolls", "rate");

    // Validate settings dynamically
    const validatedLanguage = window.voicedRolls.isValidLanguage(language) ? language : "es";
    const validatedRate = typeof rate === "number" && rate >= 0.1 && rate <= 10 ? rate : 1.5;

    if (language !== validatedLanguage) {
      ui.notifications.warn("Invalid language setting. Falling back to default: 'es'.");
      game.settings.set("voiced-rolls", "language", "es");
    }

    if (rate !== validatedRate) {
      ui.notifications.warn("Invalid rate setting. Falling back to default: 1.5.");
      ui.notifications.warn(`Invalid rate setting. Falling back to default: ${DEFAULT_RATE}.`);
      game.settings.set("voiced-rolls", "rate", DEFAULT_RATE);
    }

    // Iterate and parse individual rolls
    function parseTerms(term) {
      if (term.faces) {
        if (term.values.length > 1) {
          term.values.forEach(parseIndividualRoll);
        }
      }
    }

    // Iterate and parse the full roll
    function parseRolls(roll) {
      if (!roll || !roll.terms) return; // Error handling for undefined roll
      roll.terms.forEach(parseTerms);
      window.voicedRolls.speakMessage("Total: " + roll.total, validatedLanguage, validatedRate);
    }

    // Parse each dice roll and process grouped output
    function parseIndividualRoll(item, index, arr) {
      group_score += item;
      group_text += item;
      if (index + 1 === arr.length) {
        window.voicedRolls.speakMessage("Tirada individual: " + group_text + ".", validatedLanguage, validatedRate);
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
  } catch (error) {
    console.error("Error during dice roll processing:", error);
  }
});
