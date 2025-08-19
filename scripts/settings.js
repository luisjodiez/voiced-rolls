// Register module settings
function registerSettings() {
  console.log("settings.js loaded");

  try {
    // Register the language setting
    game.settings.register("voiced-rolls", "language", {
      name: "Speech Language",
      hint: "The language to use for speech synthesis (e.g., 'en', 'es').",
      scope: "client", // Each user can set their own value
      config: true, // Show in the settings menu
      type: String,
      default: "es"
    });

    // Register the speech rate setting
    game.settings.register("voiced-rolls", "rate", {
      name: "Speech Rate",
      hint: "The rate of speech synthesis (e.g., 1.0 for normal speed).",
      scope: "client",
      config: true, // Show in the settings menu
      type: Number,
      default: 1.5
    });
  } catch (error) {
    console.error("Error registering settings:", error);
  }
}

// Export as a global variable
window.voicedRolls = window.voicedRolls || {};
window.voicedRolls.registerSettings = registerSettings;
