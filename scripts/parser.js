// Roll Parser orchestrator for Voiced Rolls

(() => {
  const GenericAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./adapters/genericAdapter").GenericAdapter
    : window.voicedRolls?.GenericAdapter;

  const DnD5eAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./adapters/dnd5eAdapter").DnD5eAdapter
    : window.voicedRolls?.DnD5eAdapter;

  const CosmereAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./adapters/cosmereAdapter").CosmereAdapter
    : window.voicedRolls?.CosmereAdapter;

  const PbtAAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./adapters/pbtaAdapter").PbtAAdapter
    : window.voicedRolls?.PbtAAdapter;

  const formatRollSpeech = (typeof module !== "undefined" && module.exports)
    ? require("./speech").formatRollSpeech
    : window.voicedRolls?.formatRollSpeech;

  const speakMessage = (typeof module !== "undefined" && module.exports)
    ? require("./speech").speakMessage
    : window.voicedRolls?.speakMessage;

  class RollParser {
    constructor() {
      this.adapters = [];
      if (CosmereAdapter) {
        this.adapters.push(new CosmereAdapter());
      }
      if (DnD5eAdapter) {
        this.adapters.push(new DnD5eAdapter());
      }
      if (PbtAAdapter) {
        this.adapters.push(new PbtAAdapter());
      }
      if (GenericAdapter) {
        this.adapters.push(new GenericAdapter());
      }
    }

    /**
     * Selects the appropriate adapter and extracts standardized roll data.
     * @param {object} roll - Foundry Roll instance.
     * @param {object} [message] - Associated ChatMessage document.
     * @returns {object|null} Normalized roll data.
     */
    parse(roll, message) {
      if (!roll) {
        return null;
      }

      for (const adapter of this.adapters) {
        if (adapter.canHandle(roll, message)) {
          return adapter.parse(roll, message);
        }
      }

      return null;
    }

    /**
     * Processes all rolls attached to a ChatMessage document.
     * @param {object} message - ChatMessage document.
     * @param {object} [options={}] - Settings and speech options.
     */
    processMessageRolls(message, options = {}) {
      const rolls = message.rolls && message.rolls.length > 0
        ? message.rolls
        : (message.roll ? [message.roll] : []);

      if (!rolls || rolls.length === 0) {
        return;
      }

      for (const roll of rolls) {
        const parsedData = this.parse(roll, message);
        if (!parsedData) {
          continue;
        }

        const formatter = typeof formatRollSpeech === "function" ? formatRollSpeech : window.voicedRolls?.formatRollSpeech;
        const speaker = typeof speakMessage === "function" ? speakMessage : window.voicedRolls?.speakMessage;

        const speechText = formatter ? formatter(parsedData, options) : "";
        console.log("Voiced Rolls | Spoken text:", speechText);

        if (speechText && speaker) {
          speaker(speechText, options.language, options.rate);
        }
      }
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { RollParser };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.RollParser = RollParser;
  }
})();
