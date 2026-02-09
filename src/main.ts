import { registerSettings } from "./settings";
import { isValidLanguage, speakMessage } from "./speech";

// Include constants directly for Foundry VTT compatibility
const DEFAULT_RATE = 1.5; // Default speech rate
const DEFAULT_LANGUAGE = 'es'; // Default language for speech synthesis

console.log("main.ts loaded");

// Register module settings during initialization
Hooks.once('init', () => {
  try {
    registerSettings();
  } catch (error) {
    console.error("Error during module initialization:", error);
  }
});

Hooks.on('diceSoNiceRollStart' as any, (nulo: any, doc: any) => {
  let group_text = ""; // List of individual rolls for a group

  try {
    // Fetch user-configured settings dynamically
    const language = (game as any).settings.get("voiced-rolls", "language") as string;
    const rate = (game as any).settings.get("voiced-rolls", "rate") as number;

    // Validate settings dynamically
    const validatedLanguage = isValidLanguage(language) ? language : DEFAULT_LANGUAGE;
    const validatedRate = typeof rate === "number" && rate >= 0.1 && rate <= 10 ? rate : DEFAULT_RATE;

    if (language !== validatedLanguage) {
      (ui as any).notifications.warn(`Invalid language setting. Falling back to default: ${DEFAULT_LANGUAGE}.`);
      (game as any).settings.set("voiced-rolls", "language", DEFAULT_LANGUAGE);
    }

    if (rate !== validatedRate) {
      (ui as any).notifications.warn(`Invalid rate setting. Falling back to default: ${DEFAULT_RATE}.`);
      (game as any).settings.set("voiced-rolls", "rate", DEFAULT_RATE);
    }

    // Iterate and parse individual rolls
    function parseTerms(term: any) {
      if (term.faces) {
        if (term.values.length > 1) {
          term.values.forEach(parseIndividualRoll);
        }
      }
    }

    // Iterate and parse the full roll
    function parseRolls(roll: any) {
      if (!roll || !roll.terms) {
        return; // Error handling for undefined roll
      }
      roll.terms.forEach(parseTerms);
      speakMessage("Total: " + roll.total, validatedLanguage, validatedRate);
    }

    // Parse each dice roll and process grouped output
    function parseIndividualRoll(item: any, index: number, arr: any[]) {
      group_text += item;
      if (index + 1 === arr.length) {
        speakMessage("Tirada individual: " + group_text + ".", validatedLanguage, validatedRate);
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
