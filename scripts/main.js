// Main entry point for Voiced Rolls module

(() => {
  console.log("Voiced Rolls | Initializing module");

  let rollParserInstance = null;

  function getRollParser() {
    if (!rollParserInstance) {
      const ParserClass = window.voicedRolls?.RollParser;
      if (ParserClass) {
        rollParserInstance = new ParserClass();
      }
    }
    return rollParserInstance;
  }

  /**
   * Validates and retrieves current module settings.
   * @returns {object}
   */
  function getActiveSettings() {
    const defaultLang = window.voicedRolls?.DEFAULT_LANGUAGE || "es";
    const defaultRate = window.voicedRolls?.DEFAULT_RATE || 1.5;

    const rawLanguage = game.settings.get("voiced-rolls", "language");
    const rawRate = game.settings.get("voiced-rolls", "rate");

    const isValidLang = window.voicedRolls?.isValidLanguage
      ? window.voicedRolls.isValidLanguage(rawLanguage)
      : true;

    const language = isValidLang ? rawLanguage : defaultLang;
    const rate = typeof rawRate === "number" && rawRate >= 0.1 && rawRate <= 3.0 ? rawRate : defaultRate;
    const scope = game.settings.get("voiced-rolls", "scope") || "own";
    const verbosity = game.settings.get("voiced-rolls", "verbosity") || "detailed";
    const announceOutcomes = game.settings.get("voiced-rolls", "announceOutcomes") ?? true;
    const syncDiceSoNice = game.settings.get("voiced-rolls", "syncDiceSoNice") ?? false;

    return {
      language,
      rate,
      scope,
      verbosity,
      announceOutcomes,
      syncDiceSoNice
    };
  }

  /**
   * Determines whether a message roll should be vocalized based on visibility and scope.
   * @param {object} message - ChatMessage document.
   * @param {string} scope - Configured scope ("own", "all", "own_and_gm").
   * @returns {boolean}
   */
  function shouldVocalizeMessage(message, scope) {
    if (!message || !message.isContentVisible) {
      console.log("Voiced Rolls | Skipped: message not visible to current client");
      return false;
    }

    const authorId = message.author?.id || message.user?.id;
    const isOwnRoll = authorId === game.user.id;
    const isGmRoll = Boolean(message.author?.isGM);

    if (scope === "own" && !isOwnRoll) {
      console.log("Voiced Rolls | Skipped: scope is 'own' and roll is from another user:", authorId);
      return false;
    }
    if (scope === "own_and_gm" && !isOwnRoll && !isGmRoll) {
      console.log("Voiced Rolls | Skipped: scope is 'own_and_gm' and roll is not own or GM");
      return false;
    }

    return true; // "all"
  }

  // Register module settings on initialization
  Hooks.once("init", () => {
    try {
      if (window.voicedRolls?.registerSettings) {
        window.voicedRolls.registerSettings();
      }
    } catch (error) {
      console.error("Voiced Rolls | Error during module initialization:", error);
    }
  });

  // Primary hook: createChatMessage (natively detects all rolls without requiring external modules)
  Hooks.on("createChatMessage", (message) => {
    try {
      const hasRolls = Boolean(
        (message.rolls && message.rolls.length > 0) ||
        message.isRoll ||
        message.roll
      );

      if (!hasRolls) {
        return;
      }

      console.log("Voiced Rolls | Detected roll message:", message.id);
      const settings = getActiveSettings();

      if (!shouldVocalizeMessage(message, settings.scope)) {
        return;
      }

      // If Dice So Nice is active and sync is explicitly enabled, let diceSoNiceRollStart handle it
      const isDsnActive = Boolean(game.modules.get("dice-so-nice")?.active);
      if (settings.syncDiceSoNice && isDsnActive) {
        console.log("Voiced Rolls | Delegating speech to Dice So Nice animation hook");
        return;
      }

      const parser = getRollParser();
      if (parser) {
        parser.processMessageRolls(message, settings);
      } else {
        console.warn("Voiced Rolls | RollParser instance not available");
      }
    } catch (error) {
      console.error("Voiced Rolls | Error processing roll message:", error);
    }
  });

  // Secondary hook: diceSoNiceRollStart (synchronizes voice playback with 3D dice animation when present)
  Hooks.on("diceSoNiceRollStart", (messageId, context) => {
    try {
      const settings = getActiveSettings();
      if (!settings.syncDiceSoNice) {
        return;
      }

      const message = game.messages.get(messageId);
      if (!shouldVocalizeMessage(message, settings.scope)) {
        return;
      }

      const parser = getRollParser();
      if (!parser) {
        return;
      }

      if (context?.roll) {
        const parsedData = parser.parse(context.roll, message);
        if (parsedData && window.voicedRolls?.formatRollSpeech && window.voicedRolls?.speakMessage) {
          const text = window.voicedRolls.formatRollSpeech(parsedData, settings);
          if (text) {
            console.log("Voiced Rolls (DSN) | Speaking text:", text);
            window.voicedRolls.speakMessage(text, settings.language, settings.rate);
          }
        }
      } else if (message) {
        parser.processMessageRolls(message, settings);
      }
    } catch (error) {
      console.error("Voiced Rolls | Error during Dice So Nice roll processing:", error);
    }
  });
})();
