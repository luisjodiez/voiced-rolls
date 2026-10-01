// D&D 5th Edition roll adapter

(() => {
  const GenericAdapter = (typeof module !== "undefined" && module.exports)
    ? require("./genericAdapter").GenericAdapter
    : window.voicedRolls?.GenericAdapter;

  class DnD5eAdapter extends GenericAdapter {
    /**
     * Checks if this roll is from D&D 5e or has D20Roll characteristics.
     * @param {object} roll
     * @returns {boolean}
     */
    canHandle(roll) {
      if (!super.canHandle(roll)) {
        return false;
      }

      const isDnd5eSystem = typeof game !== "undefined" && game?.system?.id === "dnd5e";
      const isD20Roll = roll.constructor?.name === "D20Roll" || roll.isCritical !== undefined || roll.isFumble !== undefined;
      const hasD20Die = Array.isArray(roll.terms) && roll.terms.some(t => t.faces === 20);

      return isDnd5eSystem || isD20Roll || hasD20Die;
    }

    /**
     * Parses D&D 5e roll, detecting advantage/disadvantage, critical hits, and fumbles.
     * @param {object} roll
     * @param {object} [message]
     * @returns {object} Normalized roll data with D&D 5e outcomes.
     */
    parse(roll, message) {
      const data = super.parse(roll, message);
      if (!data) {
        return null;
      }

      const d20Term = data.diceTerms.find(t => t.faces === 20);
      if (!d20Term || d20Term.activeResults.length === 0) {
        return data;
      }

      // Check for critical success or fumble
      const activeResult = d20Term.activeResults[0];
      const isCritical = roll.isCritical === true || activeResult === 20;
      const isFumble = roll.isFumble === true || activeResult === 1;

      if (isCritical) {
        data.outcomeType = "critical_success";
      } else if (isFumble) {
        data.outcomeType = "critical_failure";
      }

      return data;
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { DnD5eAdapter };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.DnD5eAdapter = DnD5eAdapter;
  }
})();
