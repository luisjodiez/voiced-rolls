const { isValidLanguage, speakMessage, formatRollSpeech, localize, formatDiceList } = require("../scripts/speech");

describe("speech.js", () => {
  describe("isValidLanguage", () => {
    it("should return true for valid languages", () => {
      expect(isValidLanguage("en")).toBe(true);
      expect(isValidLanguage("es")).toBe(true);
    });

    it("should return false for invalid languages", () => {
      expect(isValidLanguage("xx")).toBe(false);
      expect(isValidLanguage("")).toBe(false);
    });
  });

  describe("formatDiceList", () => {
    it("should format single die", () => {
      expect(formatDiceList([14], "es")).toBe("14");
    });

    it("should format two dice with natural conjunction in Spanish", () => {
      expect(formatDiceList([3, 5], "es")).toBe("3 y 5");
    });

    it("should format three dice with natural conjunction in Spanish", () => {
      expect(formatDiceList([2, 4, 6], "es")).toBe("2, 4 y 6");
    });

    it("should format multiple dice with conjunction in English", () => {
      expect(formatDiceList([3, 5], "en")).toBe("3 and 5");
    });
  });

  describe("localize", () => {
    it("should localize templates in Spanish by default", () => {
      expect(localize("VOICEDROLLS.Speech.TotalOnly", { total: 15 }, "es")).toBe("Total 15.");
      expect(localize("VOICEDROLLS.Speech.CriticalHit", {}, "es")).toBe("¡Impacto crítico!");
    });

    it("should localize templates in English when requested", () => {
      expect(localize("VOICEDROLLS.Speech.TotalOnly", { total: 15 }, "en")).toBe("Total 15.");
      expect(localize("VOICEDROLLS.Speech.CriticalHit", {}, "en")).toBe("Critical hit!");
    });
  });

  describe("formatRollSpeech", () => {
    it("should format single die with modifier in fluid Spanish (detailed mode)", () => {
      const rollData = {
        diceTerms: [{ faces: 20, activeResults: [14], discardedResults: [] }],
        modifierTotal: 3,
        total: 17
      };
      const result = formatRollSpeech(rollData, { verbosity: "detailed", language: "es" });
      // e.g. "14, más 3, total 17."
      expect(result).toBe("14, más 3, total 17.");
    });

    it("should format multiple dice with negative modifier in English", () => {
      const rollData = {
        diceTerms: [{ faces: 6, activeResults: [3, 4], discardedResults: [] }],
        modifierTotal: -2,
        total: 5
      };
      const result = formatRollSpeech(rollData, { verbosity: "detailed", language: "en" });
      // e.g. "3 and 4, minus 2, total 5."
      expect(result).toBe("3 and 4, minus 2, total 5.");
    });

    it("should format in minimal mode with only total", () => {
      const rollData = {
        diceTerms: [{ faces: 20, activeResults: [18], discardedResults: [] }],
        modifierTotal: 5,
        total: 23
      };
      const result = formatRollSpeech(rollData, { verbosity: "minimal", language: "es" });
      expect(result).toBe("Total 23.");
    });

    it("should include critical hit and fumble outcomes naturally", () => {
      const critData = {
        diceTerms: [{ faces: 20, activeResults: [20], discardedResults: [] }],
        modifierTotal: 4,
        total: 24,
        outcomeType: "critical_success"
      };
      expect(formatRollSpeech(critData, { language: "es" })).toBe("20, más 4, total 24. ¡Impacto crítico!");
      expect(formatRollSpeech(critData, { language: "en" })).toBe("20, plus 4, total 24. Critical hit!");
    });

    it("should include Cosmere opportunities and complications naturally", () => {
      const oppData = {
        diceTerms: [{ faces: 20, activeResults: [15], discardedResults: [] }],
        modifierTotal: 2,
        total: 17,
        outcomeType: "opportunity",
        outcomeCount: 1
      };
      expect(formatRollSpeech(oppData, { language: "es" })).toBe("15, más 2, total 17. ¡Una oportunidad!");

      const compData = {
        diceTerms: [{ faces: 20, activeResults: [10], discardedResults: [] }],
        modifierTotal: 0,
        total: 10,
        outcomeType: "complication",
        outcomeCount: 2
      };
      expect(formatRollSpeech(compData, { language: "es" })).toBe("10, total 10. ¡2 complicaciones!");
    });
  });

  describe("speakMessage", () => {
    beforeEach(() => {
      global.speechSynthesis = {
        speak: jest.fn(),
      };
      global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
        text,
        lang: "",
        rate: 1,
      }));
    });

    afterEach(() => {
      delete global.speechSynthesis;
      delete global.SpeechSynthesisUtterance;
    });

    it("should call speechSynthesis.speak with correct parameters", () => {
      const text = "Hello, world!";
      const language = "en";
      const rate = 1.0;

      speakMessage(text, language, rate);

      expect(global.speechSynthesis.speak).toHaveBeenCalled();
      const utterance = global.speechSynthesis.speak.mock.calls[0][0];
      expect(utterance.text).toBe(text);
      expect(utterance.lang).toBe(language);
      expect(utterance.rate).toBe(rate);
    });

    it("should warn if speechSynthesis is not supported", () => {
      delete global.speechSynthesis;
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      speakMessage("Hello", "en", 1.0);

      expect(consoleWarnSpy).toHaveBeenCalledWith("Voiced Rolls | Web Speech API is not supported in this environment.");

      consoleWarnSpy.mockRestore();
    });
  });
});
