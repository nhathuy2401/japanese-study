import { kanaToRomaji, toRomaji } from '../romajiHelper';

describe('romajiHelper', () => {
  it('should convert pure kana to romaji accurately', () => {
    expect(kanaToRomaji('こんにちは')).toBe('konnichiha');
    expect(kanaToRomaji('ありがとう')).toBe('arigatou');
    expect(kanaToRomaji('タバコ')).toBe('tabako');
    expect(kanaToRomaji('すって')).toBe('sutte');
    expect(kanaToRomaji('がっこう')).toBe('gakkou');
    expect(kanaToRomaji('きょう')).toBe('kyou');
    expect(kanaToRomaji('コーヒー')).toBe('koohii');
  });

  it('should convert mixed sentence with kanji and punctuation to romaji', () => {
    const romaji1 = toRomaji('〜てはいけません');
    expect(romaji1).toContain('te');
    expect(romaji1).toContain('ikemasen');

    const romaji2 = toRomaji('ここで タバコを すってはいけません。');
    expect(romaji2).toContain('koko');
    expect(romaji2).toContain('tabako');
    expect(romaji2).toContain('sutte');
  });
});
