const { GenericAdapter } = require("../scripts/adapters/genericAdapter");
const { DnD5eAdapter } = require("../scripts/adapters/dnd5eAdapter");
const { CosmereAdapter } = require("../scripts/adapters/cosmereAdapter");
const { PbtAAdapter } = require("../scripts/adapters/pbtaAdapter");

describe("Roll Adapters", () => {
  describe("GenericAdapter", () => {
    const adapter = new GenericAdapter();

    it("should parse a single die with positive modifier", () => {
      const mockRoll = {
        total: 19,
        terms: [
          { faces: 20, results: [{ result: 14, active: true }] },
          { operator: "+" },
          { number: 5 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result).not.toBeNull();
      expect(result.diceTerms[0].activeResults).toEqual([14]);
      expect(result.modifierTotal).toBe(5);
      expect(result.total).toBe(19);
    });

    it("should parse multiple dice with negative modifier", () => {
      const mockRoll = {
        total: 7,
        terms: [
          { faces: 6, results: [{ result: 4, active: true }, { result: 4, active: true }] },
          { operator: "-" },
          { number: 1 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.diceTerms[0].activeResults).toEqual([4, 4]);
      expect(result.modifierTotal).toBe(-1);
      expect(result.total).toBe(7);
    });

    it("should separate kept and discarded dice (advantage/disadvantage)", () => {
      const mockRoll = {
        total: 18,
        terms: [
          {
            faces: 20,
            results: [
              { result: 15, active: true },
              { result: 6, active: false }
            ]
          },
          { operator: "+" },
          { number: 3 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.diceTerms[0].activeResults).toEqual([15]);
      expect(result.diceTerms[0].discardedResults).toEqual([6]);
      expect(result.modifierTotal).toBe(3);
      expect(result.total).toBe(18);
    });
  });

  describe("DnD5eAdapter", () => {
    const adapter = new DnD5eAdapter();

    it("should detect critical hit on natural 20", () => {
      const mockRoll = {
        total: 25,
        terms: [
          { faces: 20, results: [{ result: 20, active: true }] },
          { operator: "+" },
          { number: 5 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("critical_success");
    });

    it("should detect critical fumble on natural 1", () => {
      const mockRoll = {
        total: 3,
        terms: [
          { faces: 20, results: [{ result: 1, active: true }] },
          { operator: "+" },
          { number: 2 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("critical_failure");
    });
  });

  describe("CosmereAdapter", () => {
    const adapter = new CosmereAdapter();

    it("should detect Opportunity from PlotDie term (result 5 or 6)", () => {
      const mockRoll = {
        total: 16,
        terms: [
          { faces: 20, results: [{ result: 13, active: true }] },
          { operator: "+" },
          { number: 3 },
          { denomination: "p", results: [{ result: 6, active: true }] }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("opportunity");
      expect(result.outcomeCount).toBe(1);
    });

    it("should detect Complication from PlotDie term (result 1 or 2)", () => {
      const mockRoll = {
        total: 12,
        terms: [
          { faces: 20, results: [{ result: 10, active: true }] },
          { operator: "+" },
          { number: 2 },
          { denomination: "p", results: [{ result: 1, active: true }] }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("complication");
      expect(result.outcomeCount).toBe(1);
    });

    it("should read opportunitiesCount directly if provided by system", () => {
      const mockRoll = {
        total: 18,
        opportunitiesCount: 2,
        complicationsCount: 0,
        terms: [
          { faces: 20, results: [{ result: 15, active: true }] },
          { operator: "+" },
          { number: 3 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("opportunity");
      expect(result.outcomeCount).toBe(2);
    });
  });

  describe("PbtAAdapter", () => {
    const adapter = new PbtAAdapter();

    it("should evaluate 10+ as full success", () => {
      const mockRoll = {
        total: 10,
        terms: [
          { faces: 6, results: [{ result: 5, active: true }, { result: 4, active: true }] },
          { operator: "+" },
          { number: 1 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("pbta_success");
    });

    it("should evaluate 7-9 as mixed success", () => {
      const mockRoll = {
        total: 8,
        terms: [
          { faces: 6, results: [{ result: 3, active: true }, { result: 3, active: true }] },
          { operator: "+" },
          { number: 2 }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("pbta_mixed");
    });

    it("should evaluate 6 and below as miss", () => {
      const mockRoll = {
        total: 5,
        terms: [
          { faces: 6, results: [{ result: 2, active: true }, { result: 3, active: true }] }
        ]
      };

      const result = adapter.parse(mockRoll);
      expect(result.outcomeType).toBe("pbta_miss");
    });
  });
});
