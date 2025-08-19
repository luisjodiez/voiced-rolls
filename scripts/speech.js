// List of valid languages for speech synthesis
const validLanguages = ["en", "es", "fr", "de", "it", "ja", "ko", "zh", "ru", "pt"];

console.log("speech.js loaded");

// Function to check if a language is valid
function isValidLanguage(language) {
  return validLanguages.includes(language);
}

// Function to create and speak a message
function speakMessage(text, language, rate) {
  if (!("speechSynthesis" in window)) {
    console.warn("Web Speech API is not supported in this environment.");
    return;
  }

  try {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language;
    msg.rate = rate;
    window.speechSynthesis.speak(msg);
  } catch (error) {
    console.error("Error during speech synthesis:", error);
  }
}

// Export functions for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidLanguage, speakMessage };
}

// Export as global variables for Foundry VTT
window.voicedRolls = window.voicedRolls || {};
window.voicedRolls.isValidLanguage = isValidLanguage;
window.voicedRolls.speakMessage = speakMessage;
