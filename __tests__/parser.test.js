const { RollParser } = require("../scripts/parser");

describe("RollParser", () => {
  let parser;

  beforeEach(() => {
    parser = new RollParser();
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

  it("should select CosmereAdapter when PlotDie is present", () => {
    const mockRoll = {
      total: 15,
      terms: [
        { faces: 20, results: [{ result: 12, active: true }] },
        { operator: "+" },
        { number: 3 },
        { denomination: "p", results: [{ result: 5, active: true }] }
      ]
    };

    const parsed = parser.parse(mockRoll);
    expect(parsed).not.toBeNull();
    expect(parsed.outcomeType).toBe("opportunity");
  });

  it("should select DnD5eAdapter for a d20 roll and detect critical", () => {
    const mockRoll = {
      total: 24,
      terms: [
        { faces: 20, results: [{ result: 20, active: true }] },
        { operator: "+" },
        { number: 4 }
      ]
    };

    const parsed = parser.parse(mockRoll);
    expect(parsed).not.toBeNull();
    expect(parsed.outcomeType).toBe("critical_success");
  });

  it("should process rolls on ChatMessage document and invoke speech synthesis with natural phrasing", () => {
    const mockRoll = {
      total: 18,
      terms: [
        { faces: 20, results: [{ result: 15, active: true }] },
        { operator: "+" },
        { number: 3 }
      ]
    };

    const mockMessage = {
      rolls: [mockRoll],
      isContentVisible: true
    };

    parser.processMessageRolls(mockMessage, {
      language: "es",
      rate: 1.5,
      verbosity: "detailed",
      announceOutcomes: true
    });

    expect(global.speechSynthesis.speak).toHaveBeenCalled();
    const utterance = global.speechSynthesis.speak.mock.calls[0][0];
    expect(utterance.text).toBe("15, más 3, total 18.");
  });
});
