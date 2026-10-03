export function hashString(str) {
  let hash = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return hash >>> 0;
}

export class SeededRNG {
  constructor(seed) {
    if (typeof seed === 'string') {
      this.seedVal = hashString(seed);
    } else if (typeof seed === 'number') {
      this.seedVal = Math.floor(seed) >>> 0;
    } else {
      this.seedVal = Math.floor(Math.random() * 0xffffffff) >>> 0;
    }
  }

  next() {
    let t = (this.seedVal += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }

  rangeInt(min, max) {
    return Math.floor(this.range(min, max + 1));
  }

  nextInt(min, max) {
    return this.rangeInt(min, max);
  }

  nextFloat(min, max) {
    return this.range(min, max);
  }

  pick(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(this.next() * array.length)];
  }

  chance(p = 0.5) {
    return this.next() < p;
  }
}

export const SeedRNG = SeededRNG;


export function generateSeedString() {
  const prefixes = ['SHIELD', 'GARUDA', 'TRISHUL', 'AGNI', 'SURAKSHA', 'VAJRA', 'AKASH', 'NETRA', 'KAVACH'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}
