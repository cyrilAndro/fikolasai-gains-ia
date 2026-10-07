import { describe, expect, it } from 'vitest';
import { calculateSavings, parseInput, type SavingsInput } from './calculations';
const example: SavingsInput = { employees: 10, hoursPerWeek: 2, hourlyCost: 35, efficiencyGain: .3 };
describe('calculateSavings', () => {
  it('calcule le cas de référence sans arrondi intermédiaire', () => {
    const result = calculateSavings(example);
    expect(result.monthlyHoursCurrent).toBeCloseTo(86.6, 10);
    expect(result.monthlyHoursSaved).toBeCloseTo(25.98, 10);
    expect(result.monthlyValueSaved).toBeCloseTo(909.3, 10);
    expect(result.annualValueSaved).toBeCloseTo(10911.6, 10);
  });
  it.each([0, .2, .3, .5, 1])('respecte le gain %s', efficiencyGain => {
    const result = calculateSavings({ ...example, efficiencyGain });
    expect(result.monthlyHoursSaved).toBeCloseTo(86.6 * efficiencyGain);
    expect(result.annualValueSaved).toBeCloseTo(result.monthlyValueSaved * 12);
  });
  it('accepte les petites valeurs et les bornes supérieures', () => {
    expect(calculateSavings({ employees: 1, hoursPerWeek: .01, hourlyCost: .01, efficiencyGain: .2 }).monthlyValueSaved).toBeGreaterThan(0);
    expect(Number.isFinite(calculateSavings({ employees: 100000, hoursPerWeek: 168, hourlyCost: 100000, efficiencyGain: 1 }).annualValueSaved)).toBe(true);
  });
  it.each([
    { employees: 0 }, { employees: 1.5 }, { employees: 100001 }, { hoursPerWeek: -1 }, { hoursPerWeek: 169 },
    { hourlyCost: 0 }, { hourlyCost: 100001 }, { hourlyCost: Infinity }, { employees: NaN },
    { efficiencyGain: -1 }, { efficiencyGain: 1.01 }, { efficiencyGain: NaN },
  ])('rejette les entrées hors domaine : %j', invalid => expect(() => calculateSavings({ ...example, ...invalid })).toThrow(RangeError));
});
describe('saisie française', () => {
  it('accepte virgules et espaces extérieurs', () => expect(parseInput(' 2,5 ', 'hoursPerWeek')).toEqual({ value: 2.5, error: undefined }));
  it.each(['', '-2', 'Infinity', 'NaN', '2e4', '0', '1.2.3', 'abc', '169'])('rejette %s', value => expect(parseInput(value, 'hoursPerWeek').error).toBeTruthy());
  it('exige un entier pour les personnes', () => expect(parseInput('1,5', 'employees').error).toContain('entier'));
});
