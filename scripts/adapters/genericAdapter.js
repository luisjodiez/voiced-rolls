// Universal fallback roll adapter for any Foundry VTT system

(() => {
  const BaseAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./baseAdapter").BaseAdapter
    : window.voicedRolls?.BaseAdapter;

  class GenericAdapter extends BaseAdapter {
    /**
     * Generic adapter can handle any evaluated Foundry Roll.
     * @param {object} roll
     * @returns {boolean}
     */
    canHandle(roll) {
      return Boolean(roll && typeof roll.total !== "undefined" && Array.isArray(roll.terms));
    }

    /**
     * Extracts dice, modifiers, and total from a standard Foundry Roll.
     * @param {object} roll
     * @param {object} [message]
     * @returns {object} Normalized roll data.
     */
    parse(roll, message) {
      if (!this.canHandle(roll)) {
        return null;
      }

      const diceTerms = [];
      let modifierTotal = 0;
      let currentSign = 1;

      for (const term of roll.terms) {
        // Check for dice terms
        if (term.faces !== undefined || term.results !== undefined) {
          const activeResults = [];
          const discardedResults = [];

          if (Array.isArray(term.results)) {
            for (const res of term.results) {
              if (res.active === false) {
                discardedResults.push(res.result);
              } else {
                activeResults.push(res.result);
              }
            }
          } else if (Array.isArray(term.values)) {
            activeResults.push(...term.values);
          }

          diceTerms.push({
            faces: term.faces || "unknown",
            activeResults,
            discardedResults
          });
          continue;
        }

        // Check for operator terms (+, -)
        if (term.operator !== undefined) {
          currentSign = term.operator === "-" ? -1 : 1;
          continue;
        }

        // Check for numeric terms (static modifiers)
        if (term.number !== undefined) {
          modifierTotal += currentSign * Number(term.number);
        }
      }

      const flavor = message?.flavor || roll.options?.flavor || "";

      return {
        flavor,
        diceTerms,
        modifierTotal,
        modifierString: modifierTotal !== 0 ? (modifierTotal > 0 ? `+${modifierTotal}` : `${modifierTotal}`) : "",
        total: roll.total,
        outcomeType: null,
        outcomeCount: 0
      };
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { GenericAdapter };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.GenericAdapter = GenericAdapter;
  }
})();
