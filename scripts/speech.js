// Speech synthesis and formatting utilities for Voiced Rolls

(() => {
  const VALID_LANGUAGES = ["en", "es", "fr", "de", "it", "ja", "ko", "zh", "ru", "pt"];

  // Fallback strings when game.i18n is not initialized (e.g., unit tests)
  const FALLBACK_STRINGS = {
    es: {
      "VOICEDROLLS.Speech.ModifierPlus": "más {mod}",
      "VOICEDROLLS.Speech.ModifierMinus": "menos {mod}",
      "VOICEDROLLS.Speech.Total": "total {total}.",
      "VOICEDROLLS.Speech.TotalOnly": "Total {total}.",
      "VOICEDROLLS.Speech.CriticalHit": "¡Impacto crítico!",
      "VOICEDROLLS.Speech.CriticalFumble": "¡Pifia!",
      "VOICEDROLLS.Speech.OpportunitySingle": "¡Una oportunidad!",
      "VOICEDROLLS.Speech.OpportunityPlural": "¡{count} oportunidades!",
      "VOICEDROLLS.Speech.ComplicationSingle": "¡Una complicación!",
      "VOICEDROLLS.Speech.ComplicationPlural": "¡{count} complicaciones!",
      "VOICEDROLLS.Speech.PbtaSuccess": "Éxito completo.",
      "VOICEDROLLS.Speech.PbtaMixed": "Éxito parcial.",
      "VOICEDROLLS.Speech.PbtaMiss": "Fallo."
    },
    en: {
      "VOICEDROLLS.Speech.ModifierPlus": "plus {mod}",
      "VOICEDROLLS.Speech.ModifierMinus": "minus {mod}",
      "VOICEDROLLS.Speech.Total": "total {total}.",
      "VOICEDROLLS.Speech.TotalOnly": "Total {total}.",
      "VOICEDROLLS.Speech.CriticalHit": "Critical hit!",
      "VOICEDROLLS.Speech.CriticalFumble": "Critical fumble!",
      "VOICEDROLLS.Speech.OpportunitySingle": "One opportunity!",
      "VOICEDROLLS.Speech.OpportunityPlural": "{count} opportunities!",
      "VOICEDROLLS.Speech.ComplicationSingle": "One complication!",
      "VOICEDROLLS.Speech.ComplicationPlural": "{count} complications!",
      "VOICEDROLLS.Speech.PbtaSuccess": "Full success.",
      "VOICEDROLLS.Speech.PbtaMixed": "Mixed success.",
      "VOICEDROLLS.Speech.PbtaMiss": "Miss."
    }
  };

  /**
   * Validates if the given language code is supported.
   * @param {string} language - ISO language code.
   * @returns {boolean}
   */
  function isValidLanguage(language) {
    return VALID_LANGUAGES.includes(language);
  }

  /**
   * Localizes a key with data replacement, using game.i18n or falling back to local strings.
   * @param {string} key - Localization key.
   * @param {Record<string, string|number>} [data={}] - Interpolation values.
   * @param {string} [lang="es"] - Fallback language.
   * @returns {string}
   */
  function localize(key, data = {}, lang = "es") {
    if (typeof game !== "undefined" && game?.i18n?.format) {
      const localized = game.i18n.format(key, data);
      if (localized && localized !== key) {
        return localized;
      }
    }

    const selectedLang = FALLBACK_STRINGS[lang] ? lang : "es";
    const template = FALLBACK_STRINGS[selectedLang]?.[key] || FALLBACK_STRINGS.es[key] || "";

    return template.replace(/\{(\w+)\}/g, (match, placeholder) => {
      return data[placeholder] !== undefined ? String(data[placeholder]) : match;
    });
  }

  /**
   * Formats a list of numeric dice values into a natural spoken list.
   * e.g., in Spanish [3, 5] -> "3 y 5", [2, 4, 6] -> "2, 4 y 6"
   * e.g., in English [3, 5] -> "3 and 5", [2, 4, 6] -> "2, 4 and 6"
   * @param {number[]} results
   * @param {string} language
   * @returns {string}
   */
  function formatDiceList(results, language = "es") {
    if (!Array.isArray(results) || results.length === 0) {
      return "";
    }
    if (results.length === 1) {
      return String(results[0]);
    }
    const conjunction = language === "en" ? " and " : " y ";
    const lead = results.slice(0, -1).join(", ");
    return `${lead}${conjunction}${results[results.length - 1]}`;
  }

  /**
   * Builds a natural, conversational message string from parsed roll data.
   * Avoids robotic colons and periods mid-sentence that cause TTS engines
   * to produce awkward long pauses or read "dos puntos".
   *
   * @param {object} parsedData - Standardized roll object.
   * @param {object} [options={}] - Formatting options (verbosity, announceOutcomes, language).
   * @returns {string} The text to speak.
   */
  function formatRollSpeech(parsedData, options = {}) {
    const {
      verbosity = "detailed",
      announceOutcomes = true,
      language = "es"
    } = options;

    if (!parsedData) {
      return "";
    }

    // Minimal mode: only state the total clearly
    if (verbosity === "minimal") {
      return localize("VOICEDROLLS.Speech.TotalOnly", { total: parsedData.total }, language);
    }

    // Collect active dice results
    const allResults = [];
    if (Array.isArray(parsedData.diceTerms)) {
      for (const term of parsedData.diceTerms) {
        if (Array.isArray(term.activeResults) && term.activeResults.length > 0) {
          allResults.push(...term.activeResults);
        }
      }
    }

    const segments = [];

    // 1. Dice numbers formatted naturally ("14" or "3 y 5")
    const formattedDice = formatDiceList(allResults, language);
    if (formattedDice) {
      segments.push(formattedDice);
    }

    // 2. Modifiers in detailed mode ("más 3" or "menos 2")
    const hasModifier = typeof parsedData.modifierTotal === "number" && parsedData.modifierTotal !== 0;
    if (verbosity === "detailed" && hasModifier) {
      const absMod = Math.abs(parsedData.modifierTotal);
      if (parsedData.modifierTotal > 0) {
        segments.push(localize("VOICEDROLLS.Speech.ModifierPlus", { mod: absMod }, language));
      } else {
        segments.push(localize("VOICEDROLLS.Speech.ModifierMinus", { mod: absMod }, language));
      }
    }

    // 3. Total ("total 17.")
    // If no dice were parsed, fallback to "Total 17."
    if (segments.length === 0) {
      segments.push(localize("VOICEDROLLS.Speech.TotalOnly", { total: parsedData.total }, language));
    } else {
      segments.push(localize("VOICEDROLLS.Speech.Total", { total: parsedData.total }, language));
    }

    // Join the main roll formula into a fluid sentence using comma pauses:
    // e.g. "14, más 3, total 17."
    let sentence = segments.join(", ");

    // Ensure ending period
    if (!sentence.endsWith(".")) {
      sentence += ".";
    }

    // 4. Special outcomes (Crits, Fumbles, Opportunities, Complications, PbtA)
    // Spoken as an enthusiastic follow-up clause
    if (announceOutcomes && parsedData.outcomeType) {
      let outcomeText = "";
      switch (parsedData.outcomeType) {
        case "critical_success":
          outcomeText = localize("VOICEDROLLS.Speech.CriticalHit", {}, language);
          break;
        case "critical_failure":
          outcomeText = localize("VOICEDROLLS.Speech.CriticalFumble", {}, language);
          break;
        case "opportunity": {
          const count = parsedData.outcomeCount || 1;
          const key = count > 1 ? "VOICEDROLLS.Speech.OpportunityPlural" : "VOICEDROLLS.Speech.OpportunitySingle";
          outcomeText = localize(key, { count }, language);
          break;
        }
        case "complication": {
          const count = parsedData.outcomeCount || 1;
          const key = count > 1 ? "VOICEDROLLS.Speech.ComplicationPlural" : "VOICEDROLLS.Speech.ComplicationSingle";
          outcomeText = localize(key, { count }, language);
          break;
        }
        case "pbta_success":
          outcomeText = localize("VOICEDROLLS.Speech.PbtaSuccess", {}, language);
          break;
        case "pbta_mixed":
          outcomeText = localize("VOICEDROLLS.Speech.PbtaMixed", {}, language);
          break;
        case "pbta_miss":
          outcomeText = localize("VOICEDROLLS.Speech.PbtaMiss", {}, language);
          break;
        default:
          break;
      }

      if (outcomeText) {
        sentence = `${sentence} ${outcomeText}`;
      }
    }

    return sentence.trim();
  }

  /**
   * Sends a text utterance to the Web Speech API.
   * @param {string} text - Text to synthesize.
   * @param {string} [language="es"] - Speech language.
   * @param {number} [rate=1.5] - Speech rate.
   */
  function speakMessage(text, language = "es", rate = 1.5) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Voiced Rolls | Web Speech API is not supported in this environment.");
      return;
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Voiced Rolls | Error during speech synthesis:", error);
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      VALID_LANGUAGES,
      isValidLanguage,
      localize,
      formatDiceList,
      formatRollSpeech,
      speakMessage
    };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.VALID_LANGUAGES = VALID_LANGUAGES;
    window.voicedRolls.isValidLanguage = isValidLanguage;
    window.voicedRolls.localize = localize;
    window.voicedRolls.formatDiceList = formatDiceList;
    window.voicedRolls.formatRollSpeech = formatRollSpeech;
    window.voicedRolls.speakMessage = speakMessage;
  }
})();
