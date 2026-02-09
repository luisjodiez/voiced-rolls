// List of valid languages for speech synthesis
export const validLanguages = ["en", "es", "fr", "de", "it", "ja", "ko", "zh", "ru", "pt"];
console.log("speech.ts loaded");
/**
 * Function to check if a language is valid
 * @param language The language code to check
 * @returns True if valid, false otherwise
 */
export function isValidLanguage(language) {
    return typeof language === "string" && validLanguages.includes(language);
}
/**
 * Function to create and speak a message
 * @param text The text to speak
 * @param language The language code to use
 * @param rate The speed of speech
 */
export function speakMessage(text, language, rate) {
    if (!("speechSynthesis" in window)) {
        console.warn("Web Speech API is not supported in this environment.");
        return;
    }
    try {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = language;
        msg.rate = rate;
        window.speechSynthesis.speak(msg);
    }
    catch (error) {
        console.error("Error during speech synthesis:", error);
    }
}
window.voicedRolls = window.voicedRolls || {};
window.voicedRolls.isValidLanguage = isValidLanguage;
window.voicedRolls.speakMessage = speakMessage;
