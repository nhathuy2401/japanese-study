import { speechService } from '../speechService';
import * as Speech from 'expo-speech';

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn().mockResolvedValue(undefined),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
  getAvailableVoicesAsync: jest.fn().mockResolvedValue([
    { identifier: 'com.apple.voice.compact.ja-JP.Kyoko', language: 'ja-JP', name: 'Kyoko', quality: 'Enhanced' },
    { identifier: 'com.apple.voice.compact.en-US.Samantha', language: 'en-US', name: 'Samantha', quality: 'Default' },
  ]),
}));

describe('SpeechService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Speech.speak with ja-JP and proper options', async () => {
    const onStart = jest.fn();
    const onDone = jest.fn();

    await speechService.speakJapanese('これ を ください。', {
      rate: 0.8,
      pitch: 1.0,
      onStart,
      onDone,
    });

    expect(Speech.speak).toHaveBeenCalledWith(
      'これ を ください。',
      expect.objectContaining({
        language: 'ja-JP',
        rate: 0.8,
        pitch: 1.0,
      })
    );
  });

  it('should stop speaking when stop() is called', async () => {
    await speechService.stop();
    expect(Speech.stop).toHaveBeenCalled();
  });

  it('should filter only Japanese voices from getJapaneseVoices()', async () => {
    const jaVoices = await speechService.getJapaneseVoices();
    expect(jaVoices.length).toBe(1);
    expect(jaVoices[0].language).toBe('ja-JP');
    expect(jaVoices[0].name).toBe('Kyoko');
  });

  it('should not call Speech.speak if text is empty', async () => {
    await speechService.speakJapanese('   ');
    expect(Speech.speak).not.toHaveBeenCalled();
  });
});

