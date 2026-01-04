import { Kana, KanaType, KanaGroup } from '../types';

function createKana(
  character: string,
  romaji: string,
  type: KanaType,
  group: KanaGroup
): Kana {
  return {
    id: `${type}-${romaji}`,
    character,
    romaji,
    type,
    group,
  };
}

const hiraganaBasic: Kana[] = [
  // Vowels
  createKana('あ', 'a', 'hiragana', 'vowel'),
  createKana('い', 'i', 'hiragana', 'vowel'),
  createKana('う', 'u', 'hiragana', 'vowel'),
  createKana('え', 'e', 'hiragana', 'vowel'),
  createKana('お', 'o', 'hiragana', 'vowel'),
  // K row
  createKana('か', 'ka', 'hiragana', 'k'),
  createKana('き', 'ki', 'hiragana', 'k'),
  createKana('く', 'ku', 'hiragana', 'k'),
  createKana('け', 'ke', 'hiragana', 'k'),
  createKana('こ', 'ko', 'hiragana', 'k'),
  // S row
  createKana('さ', 'sa', 'hiragana', 's'),
  createKana('し', 'shi', 'hiragana', 's'),
  createKana('す', 'su', 'hiragana', 's'),
  createKana('せ', 'se', 'hiragana', 's'),
  createKana('そ', 'so', 'hiragana', 's'),
  // T row
  createKana('た', 'ta', 'hiragana', 't'),
  createKana('ち', 'chi', 'hiragana', 't'),
  createKana('つ', 'tsu', 'hiragana', 't'),
  createKana('て', 'te', 'hiragana', 't'),
  createKana('と', 'to', 'hiragana', 't'),
  // N row
  createKana('な', 'na', 'hiragana', 'n'),
  createKana('に', 'ni', 'hiragana', 'n'),
  createKana('ぬ', 'nu', 'hiragana', 'n'),
  createKana('ね', 'ne', 'hiragana', 'n'),
  createKana('の', 'no', 'hiragana', 'n'),
  // H row
  createKana('は', 'ha', 'hiragana', 'h'),
  createKana('ひ', 'hi', 'hiragana', 'h'),
  createKana('ふ', 'fu', 'hiragana', 'h'),
  createKana('へ', 'he', 'hiragana', 'h'),
  createKana('ほ', 'ho', 'hiragana', 'h'),
  // M row
  createKana('ま', 'ma', 'hiragana', 'm'),
  createKana('み', 'mi', 'hiragana', 'm'),
  createKana('む', 'mu', 'hiragana', 'm'),
  createKana('め', 'me', 'hiragana', 'm'),
  createKana('も', 'mo', 'hiragana', 'm'),
  // Y row
  createKana('や', 'ya', 'hiragana', 'y'),
  createKana('ゆ', 'yu', 'hiragana', 'y'),
  createKana('よ', 'yo', 'hiragana', 'y'),
  // R row
  createKana('ら', 'ra', 'hiragana', 'r'),
  createKana('り', 'ri', 'hiragana', 'r'),
  createKana('る', 'ru', 'hiragana', 'r'),
  createKana('れ', 're', 'hiragana', 'r'),
  createKana('ろ', 'ro', 'hiragana', 'r'),
  // W row
  createKana('わ', 'wa', 'hiragana', 'w'),
  createKana('を', 'wo', 'hiragana', 'w'),
  // N
  createKana('ん', 'n', 'hiragana', 'nn'),
];

const hiraganaDakuten: Kana[] = [
  // G row (dakuten of K)
  createKana('が', 'ga', 'hiragana', 'g'),
  createKana('ぎ', 'gi', 'hiragana', 'g'),
  createKana('ぐ', 'gu', 'hiragana', 'g'),
  createKana('げ', 'ge', 'hiragana', 'g'),
  createKana('ご', 'go', 'hiragana', 'g'),
  // Z row (dakuten of S)
  createKana('ざ', 'za', 'hiragana', 'z'),
  createKana('じ', 'ji', 'hiragana', 'z'),
  createKana('ず', 'zu', 'hiragana', 'z'),
  createKana('ぜ', 'ze', 'hiragana', 'z'),
  createKana('ぞ', 'zo', 'hiragana', 'z'),
  // D row (dakuten of T)
  createKana('だ', 'da', 'hiragana', 'd'),
  createKana('ぢ', 'di', 'hiragana', 'd'),
  createKana('づ', 'du', 'hiragana', 'd'),
  createKana('で', 'de', 'hiragana', 'd'),
  createKana('ど', 'do', 'hiragana', 'd'),
  // B row (dakuten of H)
  createKana('ば', 'ba', 'hiragana', 'b'),
  createKana('び', 'bi', 'hiragana', 'b'),
  createKana('ぶ', 'bu', 'hiragana', 'b'),
  createKana('べ', 'be', 'hiragana', 'b'),
  createKana('ぼ', 'bo', 'hiragana', 'b'),
];

const hiraganaHandakuten: Kana[] = [
  // P row (handakuten of H)
  createKana('ぱ', 'pa', 'hiragana', 'p'),
  createKana('ぴ', 'pi', 'hiragana', 'p'),
  createKana('ぷ', 'pu', 'hiragana', 'p'),
  createKana('ぺ', 'pe', 'hiragana', 'p'),
  createKana('ぽ', 'po', 'hiragana', 'p'),
];

const hiraganaYoon: Kana[] = [
  // Ky row
  createKana('きゃ', 'kya', 'hiragana', 'ky'),
  createKana('きゅ', 'kyu', 'hiragana', 'ky'),
  createKana('きょ', 'kyo', 'hiragana', 'ky'),
  // Sh row
  createKana('しゃ', 'sha', 'hiragana', 'sy'),
  createKana('しゅ', 'shu', 'hiragana', 'sy'),
  createKana('しょ', 'sho', 'hiragana', 'sy'),
  // Ch row
  createKana('ちゃ', 'cha', 'hiragana', 'ty'),
  createKana('ちゅ', 'chu', 'hiragana', 'ty'),
  createKana('ちょ', 'cho', 'hiragana', 'ty'),
  // Ny row
  createKana('にゃ', 'nya', 'hiragana', 'ny'),
  createKana('にゅ', 'nyu', 'hiragana', 'ny'),
  createKana('にょ', 'nyo', 'hiragana', 'ny'),
  // Hy row
  createKana('ひゃ', 'hya', 'hiragana', 'hy'),
  createKana('ひゅ', 'hyu', 'hiragana', 'hy'),
  createKana('ひょ', 'hyo', 'hiragana', 'hy'),
  // My row
  createKana('みゃ', 'mya', 'hiragana', 'my'),
  createKana('みゅ', 'myu', 'hiragana', 'my'),
  createKana('みょ', 'myo', 'hiragana', 'my'),
  // Ry row
  createKana('りゃ', 'rya', 'hiragana', 'ry'),
  createKana('りゅ', 'ryu', 'hiragana', 'ry'),
  createKana('りょ', 'ryo', 'hiragana', 'ry'),
  // Gy row
  createKana('ぎゃ', 'gya', 'hiragana', 'gy'),
  createKana('ぎゅ', 'gyu', 'hiragana', 'gy'),
  createKana('ぎょ', 'gyo', 'hiragana', 'gy'),
  // Jy row
  createKana('じゃ', 'ja', 'hiragana', 'zy'),
  createKana('じゅ', 'ju', 'hiragana', 'zy'),
  createKana('じょ', 'jo', 'hiragana', 'zy'),
  // By row
  createKana('びゃ', 'bya', 'hiragana', 'by'),
  createKana('びゅ', 'byu', 'hiragana', 'by'),
  createKana('びょ', 'byo', 'hiragana', 'by'),
  // Py row
  createKana('ぴゃ', 'pya', 'hiragana', 'py'),
  createKana('ぴゅ', 'pyu', 'hiragana', 'py'),
  createKana('ぴょ', 'pyo', 'hiragana', 'py'),
];

const katakanaBasic: Kana[] = [
  // Vowels
  createKana('ア', 'a', 'katakana', 'vowel'),
  createKana('イ', 'i', 'katakana', 'vowel'),
  createKana('ウ', 'u', 'katakana', 'vowel'),
  createKana('エ', 'e', 'katakana', 'vowel'),
  createKana('オ', 'o', 'katakana', 'vowel'),
  // K row
  createKana('カ', 'ka', 'katakana', 'k'),
  createKana('キ', 'ki', 'katakana', 'k'),
  createKana('ク', 'ku', 'katakana', 'k'),
  createKana('ケ', 'ke', 'katakana', 'k'),
  createKana('コ', 'ko', 'katakana', 'k'),
  // S row
  createKana('サ', 'sa', 'katakana', 's'),
  createKana('シ', 'shi', 'katakana', 's'),
  createKana('ス', 'su', 'katakana', 's'),
  createKana('セ', 'se', 'katakana', 's'),
  createKana('ソ', 'so', 'katakana', 's'),
  // T row
  createKana('タ', 'ta', 'katakana', 't'),
  createKana('チ', 'chi', 'katakana', 't'),
  createKana('ツ', 'tsu', 'katakana', 't'),
  createKana('テ', 'te', 'katakana', 't'),
  createKana('ト', 'to', 'katakana', 't'),
  // N row
  createKana('ナ', 'na', 'katakana', 'n'),
  createKana('ニ', 'ni', 'katakana', 'n'),
  createKana('ヌ', 'nu', 'katakana', 'n'),
  createKana('ネ', 'ne', 'katakana', 'n'),
  createKana('ノ', 'no', 'katakana', 'n'),
  // H row
  createKana('ハ', 'ha', 'katakana', 'h'),
  createKana('ヒ', 'hi', 'katakana', 'h'),
  createKana('フ', 'fu', 'katakana', 'h'),
  createKana('ヘ', 'he', 'katakana', 'h'),
  createKana('ホ', 'ho', 'katakana', 'h'),
  // M row
  createKana('マ', 'ma', 'katakana', 'm'),
  createKana('ミ', 'mi', 'katakana', 'm'),
  createKana('ム', 'mu', 'katakana', 'm'),
  createKana('メ', 'me', 'katakana', 'm'),
  createKana('モ', 'mo', 'katakana', 'm'),
  // Y row
  createKana('ヤ', 'ya', 'katakana', 'y'),
  createKana('ユ', 'yu', 'katakana', 'y'),
  createKana('ヨ', 'yo', 'katakana', 'y'),
  // R row
  createKana('ラ', 'ra', 'katakana', 'r'),
  createKana('リ', 'ri', 'katakana', 'r'),
  createKana('ル', 'ru', 'katakana', 'r'),
  createKana('レ', 're', 'katakana', 'r'),
  createKana('ロ', 'ro', 'katakana', 'r'),
  // W row
  createKana('ワ', 'wa', 'katakana', 'w'),
  createKana('ヲ', 'wo', 'katakana', 'w'),
  // N
  createKana('ン', 'n', 'katakana', 'nn'),
];

const katakanaDakuten: Kana[] = [
  // G row
  createKana('ガ', 'ga', 'katakana', 'g'),
  createKana('ギ', 'gi', 'katakana', 'g'),
  createKana('グ', 'gu', 'katakana', 'g'),
  createKana('ゲ', 'ge', 'katakana', 'g'),
  createKana('ゴ', 'go', 'katakana', 'g'),
  // Z row
  createKana('ザ', 'za', 'katakana', 'z'),
  createKana('ジ', 'ji', 'katakana', 'z'),
  createKana('ズ', 'zu', 'katakana', 'z'),
  createKana('ゼ', 'ze', 'katakana', 'z'),
  createKana('ゾ', 'zo', 'katakana', 'z'),
  // D row
  createKana('ダ', 'da', 'katakana', 'd'),
  createKana('ヂ', 'di', 'katakana', 'd'),
  createKana('ヅ', 'du', 'katakana', 'd'),
  createKana('デ', 'de', 'katakana', 'd'),
  createKana('ド', 'do', 'katakana', 'd'),
  // B row
  createKana('バ', 'ba', 'katakana', 'b'),
  createKana('ビ', 'bi', 'katakana', 'b'),
  createKana('ブ', 'bu', 'katakana', 'b'),
  createKana('ベ', 'be', 'katakana', 'b'),
  createKana('ボ', 'bo', 'katakana', 'b'),
];

const katakanaHandakuten: Kana[] = [
  // P row
  createKana('パ', 'pa', 'katakana', 'p'),
  createKana('ピ', 'pi', 'katakana', 'p'),
  createKana('プ', 'pu', 'katakana', 'p'),
  createKana('ペ', 'pe', 'katakana', 'p'),
  createKana('ポ', 'po', 'katakana', 'p'),
];

const katakanaYoon: Kana[] = [
  // Ky row
  createKana('キャ', 'kya', 'katakana', 'ky'),
  createKana('キュ', 'kyu', 'katakana', 'ky'),
  createKana('キョ', 'kyo', 'katakana', 'ky'),
  // Sh row
  createKana('シャ', 'sha', 'katakana', 'sy'),
  createKana('シュ', 'shu', 'katakana', 'sy'),
  createKana('ショ', 'sho', 'katakana', 'sy'),
  // Ch row
  createKana('チャ', 'cha', 'katakana', 'ty'),
  createKana('チュ', 'chu', 'katakana', 'ty'),
  createKana('チョ', 'cho', 'katakana', 'ty'),
  // Ny row
  createKana('ニャ', 'nya', 'katakana', 'ny'),
  createKana('ニュ', 'nyu', 'katakana', 'ny'),
  createKana('ニョ', 'nyo', 'katakana', 'ny'),
  // Hy row
  createKana('ヒャ', 'hya', 'katakana', 'hy'),
  createKana('ヒュ', 'hyu', 'katakana', 'hy'),
  createKana('ヒョ', 'hyo', 'katakana', 'hy'),
  // My row
  createKana('ミャ', 'mya', 'katakana', 'my'),
  createKana('ミュ', 'myu', 'katakana', 'my'),
  createKana('ミョ', 'myo', 'katakana', 'my'),
  // Ry row
  createKana('リャ', 'rya', 'katakana', 'ry'),
  createKana('リュ', 'ryu', 'katakana', 'ry'),
  createKana('リョ', 'ryo', 'katakana', 'ry'),
  // Gy row
  createKana('ギャ', 'gya', 'katakana', 'gy'),
  createKana('ギュ', 'gyu', 'katakana', 'gy'),
  createKana('ギョ', 'gyo', 'katakana', 'gy'),
  // Jy row
  createKana('ジャ', 'ja', 'katakana', 'zy'),
  createKana('ジュ', 'ju', 'katakana', 'zy'),
  createKana('ジョ', 'jo', 'katakana', 'zy'),
  // By row
  createKana('ビャ', 'bya', 'katakana', 'by'),
  createKana('ビュ', 'byu', 'katakana', 'by'),
  createKana('ビョ', 'byo', 'katakana', 'by'),
  // Py row
  createKana('ピャ', 'pya', 'katakana', 'py'),
  createKana('ピュ', 'pyu', 'katakana', 'py'),
  createKana('ピョ', 'pyo', 'katakana', 'py'),
];

export const hiraganaList: Kana[] = [
  ...hiraganaBasic,
  ...hiraganaDakuten,
  ...hiraganaHandakuten,
  ...hiraganaYoon,
];

export const katakanaList: Kana[] = [
  ...katakanaBasic,
  ...katakanaDakuten,
  ...katakanaHandakuten,
  ...katakanaYoon,
];

export const allKana: Kana[] = [...hiraganaList, ...katakanaList];

export function getKanaById(id: string): Kana | undefined {
  return allKana.find((kana) => kana.id === id);
}

export function getKanaByType(type: KanaType): Kana[] {
  return type === 'hiragana' ? hiraganaList : katakanaList;
}

export function getKanaByGroup(group: KanaGroup): Kana[] {
  return allKana.filter((kana) => kana.group === group);
}

export function getBasicKana(type: KanaType): Kana[] {
  const list = type === 'hiragana' ? hiraganaBasic : katakanaBasic;
  return list;
}

export const groupNames: Record<KanaGroup, string> = {
  vowel: 'Vowels (a, i, u, e, o)',
  k: 'K Row (ka, ki, ku, ke, ko)',
  s: 'S Row (sa, shi, su, se, so)',
  t: 'T Row (ta, chi, tsu, te, to)',
  n: 'N Row (na, ni, nu, ne, no)',
  h: 'H Row (ha, hi, fu, he, ho)',
  m: 'M Row (ma, mi, mu, me, mo)',
  y: 'Y Row (ya, yu, yo)',
  r: 'R Row (ra, ri, ru, re, ro)',
  w: 'W Row (wa, wo)',
  nn: 'N (n)',
  g: 'G Row - Dakuten',
  z: 'Z Row - Dakuten',
  d: 'D Row - Dakuten',
  b: 'B Row - Dakuten',
  p: 'P Row - Handakuten',
  ky: 'Ky Row - Yoon',
  sy: 'Sh Row - Yoon',
  ty: 'Ch Row - Yoon',
  ny: 'Ny Row - Yoon',
  hy: 'Hy Row - Yoon',
  my: 'My Row - Yoon',
  ry: 'Ry Row - Yoon',
  gy: 'Gy Row - Yoon',
  zy: 'J Row - Yoon',
  by: 'By Row - Yoon',
  py: 'Py Row - Yoon',
};

export const basicGroups: KanaGroup[] = [
  'vowel', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'nn'
];

export const dakutenGroups: KanaGroup[] = ['g', 'z', 'd', 'b', 'p'];

export const yoonGroups: KanaGroup[] = [
  'ky', 'sy', 'ty', 'ny', 'hy', 'my', 'ry', 'gy', 'zy', 'by', 'py'
];

export function findPairedKana(kana: Kana): Kana | undefined {
  const pairedType = kana.type === 'hiragana' ? 'katakana' : 'hiragana';
  return allKana.find(k => k.romaji === kana.romaji && k.type === pairedType);
}

export interface KanaPair {
  hiragana: Kana;
  katakana: Kana;
  romaji: string;
}

export function getPairingCards(): KanaPair[] {
  return hiraganaList.map(h => ({
    hiragana: h,
    katakana: findPairedKana(h)!,
    romaji: h.romaji,
  }));
}
