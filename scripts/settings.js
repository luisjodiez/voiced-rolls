// Settings registration for Voiced Rolls module

(() => {
  const DEFAULT_RATE = 1.5;
  const DEFAULT_LANGUAGE = "es";

  /**
   * Registers all client and world settings with Foundry VTT.
   */
  function registerSettings() {
    console.log("Voiced Rolls | Registering module settings");

    try {
      // Speech synthesis language
      game.settings.register("voiced-rolls", "language", {
        name: game.i18n.localize("VOICEDROLLS.Settings.LanguageName"),
        hint: game.i18n.localize("VOICEDROLLS.Settings.LanguageHint"),
        scope: "client",
        config: true,
        type: String,
        default: DEFAULT_LANGUAGE
      });

      // Speech rate
      game.settings.register("voiced-rolls", "rate", {
        name: game.i18n.localize("VOICEDROLLS.Settings.RateName"),
        hint: game.i18n.localize("VOICEDROLLS.Settings.RateHint"),
        scope: "client",
        config: true,
        type: Number,
        default: DEFAULT_RATE,
        range: {
          min: 0.1,
          max: 3.0,
          step: 0.1
        }
      });

      // Voice scope (who to listen to)
      game.settings.register("voiced-rolls", "scope", {
        name: game.i18n.localize("VOICEDROLLS.Settings.ScopeName"),
        hint: game.i18n.localize("VOICEDROLLS.Settings.ScopeHint"),
        scope: "client",
        config: true,
        type: String,
        choices: {
          own: "VOICEDROLLS.Settings.ScopeOwn",
          all: "VOICEDROLLS.Settings.ScopeAll",
          own_and_gm: "VOICEDROLLS.Settings.ScopeOwnAndGM"
        },
        default: "own"
      });

      // Verbosity / detail level
      game.settings.register("voiced-rolls", "verbosity", {
        name: game.i18n.localize("VOICEDROLLS.Settings.VerbosityName"),
        hint: game.i18n.localize("VOICEDROLLS.Settings.VerbosityHint"),
        scope: "client",
        config: true,
        type: String,
        choices: {
          detailed: "VOICEDROLLS.Settings.VerbosityDetailed",
          standard: "VOICEDROLLS.Settings.VerbosityStandard",
          minimal: "VOICEDROLLS.Settings.VerbosityMinimal"
        },
        default: "detailed"
      });

      // Announce special outcomes (crits, fumbles, opportunities, complications)
      game.settings.register("voiced-rolls", "announceOutcomes", {
        name: game.i18n.localize("VOICEDROLLS.Settings.AnnounceOutcomesName"),
        hint: game.i18n.localize("VOICEDROLLS.Settings.AnnounceOutcomesHint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true
      });

      // Synchronize with Dice So Nice if active (default false to stay decoupled)
      game.settings.register("voiced-rolls", "syncDiceSoNice", {
        name: game.i18n.localize("VOICEDROLLS.Settings.SyncDsnName"),
        hint: game.i18n.localize("VOICEDROLLS.Settings.SyncDsnHint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false
      });
    } catch (error) {
      console.error("Voiced Rolls | Error registering settings:", error);
    }
  }

  // Export for Node.js / Jest unit tests
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      DEFAULT_RATE,
      DEFAULT_LANGUAGE,
      registerSettings
    };
  }

  // Export to window for Foundry VTT
  if (typeof window !== "undefined") {
    window.voicedRolls = window.voicedRolls || {};
    window.voicedRolls.DEFAULT_RATE = DEFAULT_RATE;
    window.voicedRolls.DEFAULT_LANGUAGE = DEFAULT_LANGUAGE;
    window.voicedRolls.registerSettings = registerSettings;
  }
})();
