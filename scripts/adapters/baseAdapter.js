// Base Adapter interface for Voiced Rolls

(() => {
  /**
   * Base roll adapter that all system adapters extend.
   */
  class BaseAdapter {
    /**
     * Determines if this adapter can process the given roll.
     * @param {object} roll - Foundry Roll instance.
     * @param {object} [message] - Associated ChatMessage document.
     * @returns {boolean}
     */
    canHandle(roll, message) {
      return false;
    }

    /**
     * Parses the roll into a normalized data structure.
     * @param {object} roll - Foundry Roll instance.
     * @param {object} [message] - Associated ChatMessage document.
     * @returns {object|null} Standardized roll representation.
     */
    parse(roll, message) {
      return null;
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { BaseAdapter };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.BaseAdapter = BaseAdapter;
  }
})();
