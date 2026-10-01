// Cosmere RPG roll adapter

(() => {
  const GenericAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./genericAdapter").GenericAdapter
    : window.voicedRolls?.GenericAdapter;

  class CosmereAdapter extends GenericAdapter {
    /**
     * Checks if this roll is from Cosmere RPG.
     * @param {object} roll
     * @returns {boolean}
     */
    canHandle(roll) {
      if (!super.canHandle(roll)) {
        return false;
      }

      const isCosmereSystem = typeof game !== "undefined" && game?.system?.id === "cosmere-rpg";
      const hasPlotDie = roll.hasPlotDie !== undefined || roll.complicationsCount !== undefined;
      const hasPlotTerm = Array.isArray(roll.terms) && roll.terms.some(t => t.denomination === "p" || t.isPlotDie);

      return isCosmereSystem || hasPlotDie || hasPlotTerm;
    }

    /**
     * Parses Cosmere RPG roll, detecting Plot Die opportunities and complications.
     * @param {object} roll
     * @param {object} [message]
     * @returns {object} Normalized roll data with Cosmere outcomes.
     */
    parse(roll, message) {
      const data = super.parse(roll, message);
      if (!data) {
        return null;
      }

      let opportunities = typeof roll.opportunitiesCount === "number" ? roll.opportunitiesCount : 0;
      let complications = typeof roll.complicationsCount === "number" ? roll.complicationsCount : 0;

      // If counts are not directly available on roll object, count from terms
      if (opportunities === 0 && complications === 0 && Array.isArray(roll.terms)) {
        for (const term of roll.terms) {
          if (term.denomination === "p" || term.isPlotDie) {
            const results = term.results || [];
            for (const res of results) {
              const val = res.result;
              if (val === 5 || val === 6 || res.success === true) {
                opportunities += 1;
              } else if (val === 1 || val === 2 || res.failure === true) {
                complications += 1;
              }
            }
          }
        }
      }

      if (opportunities > 0) {
        data.outcomeType = "opportunity";
        data.outcomeCount = opportunities;
      } else if (complications > 0) {
        data.outcomeType = "complication";
        data.outcomeCount = complications;
      }

      return data;
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { CosmereAdapter };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.CosmereAdapter = CosmereAdapter;
  }
})();
