import { isValidLanguage, speakMessage } from '../src/speech';

describe('speech.ts', () => {
  describe('isValidLanguage', () => {
    it('should return true for valid languages', () => {
      expect(isValidLanguage('en')).toBe(true);
      expect(isValidLanguage('es')).toBe(true);
    });

    it('should return false for invalid languages', () => {
      expect(isValidLanguage('xx')).toBe(false);
      expect(isValidLanguage('')).toBe(false);
    });
  });

  describe('speakMessage', () => {
    beforeEach(() => {
      (global as any).speechSynthesis = {
        speak: jest.fn(),
      };
      (global as any).SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
        text,
        lang: '',
        rate: 1,
      }));
    });

    afterEach(() => {
      delete (global as any).speechSynthesis;
      delete (global as any).SpeechSynthesisUtterance;
    });

    it('should call speechSynthesis.speak with correct parameters', () => {
      const text = 'Hello, world!';
      const language = 'en';
      const rate = 1.0;

      speakMessage(text, language, rate);

      expect((global as any).speechSynthesis.speak).toHaveBeenCalled();
      const utterance = (global as any).speechSynthesis.speak.mock.calls[0][0];
      expect(utterance.text).toBe(text);
      expect(utterance.lang).toBe(language);
      expect(utterance.rate).toBe(rate);
    });

    it('should warn if speechSynthesis is not supported', () => {
      delete (global as any).speechSynthesis;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      speakMessage('Hello', 'en', 1.0);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Web Speech API is not supported in this environment.');

      consoleWarnSpy.mockRestore();
    });
  });
});
