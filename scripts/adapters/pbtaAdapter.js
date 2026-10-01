// Powered by the Apocalypse / Dungeon World roll adapter

(() => {
  const GenericAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./genericAdapter").GenericAdapter
    : window.voicedRolls?.GenericAdapter;

  class PbtAAdapter extends GenericAdapter {
    /**
     * Checks if this roll is from PbtA, Dungeon World, or a 2d6 move roll.
     * @param {object} roll
     * @returns {boolean}
     */
    canHandle(roll) {
      if (!super.canHandle(roll)) {
        return false;
      }

      const systemId = typeof game !== "undefined" ? game?.system?.id : "";
      const isPbtaSystem = systemId === "pbta" || systemId === "dungeonworld" || systemId?.includes("pbta");
      const is2d6 = Array.isArray(roll.terms) && roll.terms[0]?.faces === 6 && (roll.terms[0]?.number === 2 || roll.terms[0]?.results?.length === 2);

      return Boolean(isPbtaSystem || is2d6);
    }

    /**
     * Parses PbtA roll, evaluating success tiers (10+, 7-9, 6-).
     * @param {object} roll
     * @param {object} [message]
     * @returns {object} Normalized roll data with PbtA tier outcomes.
     */
    parse(roll, message) {
      const data = super.parse(roll, message);
      if (!data) {
        return null;
      }

      const total = data.total;
      if (typeof total === "number") {
        if (total >= 10) {
          data.outcomeType = "pbta_success";
        } else if (total >= 7) {
          data.outcomeType = "pbta_mixed";
        } else {
          data.outcomeType = "pbta_miss";
        }
      }

      return data;
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { PbtAAdapter };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.PbtAAdapter = PbtAAdapter;
  }
})();
