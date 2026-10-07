import { translate, type Language } from '../config/language';
export const WEEKS_PER_MONTH = 4.33;
export const limits = { employees: 100_000, hoursPerWeek: 168, hourlyCost: 100_000 } as const;
export type NumericField = keyof typeof limits;
export type SavingsInput = Record<NumericField, number> & { efficiencyGain: number };
export function parseInput(value: string, field: NumericField, language: Language = 'fr'): { value: number; error?: string } {
  const text = value.trim();
  const valueNumber = /^\d+(?:[.,]\d+)?$/.test(text) ? Number(text.replace(',', '.')) : NaN;
  let error: string | undefined;
  if (!text) error = 'Renseignez ce champ pour voir votre estimation.';
  else if (!Number.isFinite(valueNumber) || valueNumber <= 0) error = 'Saisissez un nombre supérieur à 0.';
  else if (field === 'employees' && !Number.isInteger(valueNumber)) error = 'Saisissez un nombre entier de personnes.';
  else if (valueNumber > limits[field]) error = `Maximum : ${limits[field].toLocaleString('fr-FR')}${field === 'hoursPerWeek' ? ' heures par semaine' : field === 'employees' ? ' personnes' : ' € par heure'}.`;
  if (valueNumber > limits[field] && error?.startsWith('Maximum') && language === 'en') error = `Maximum: ${limits[field].toLocaleString('en-GB')}${field === 'hoursPerWeek' ? ' hours per week' : field === 'employees' ? ' people' : ' euros per hour'}.`;
  return { value: valueNumber, error: error ? translate(language, error) : undefined };
}
/** efficiencyGain is a fraction from 0 to 1. Never round intermediate results. */
export function calculateSavings(input: SavingsInput) {
  for (const field of Object.keys(limits) as NumericField[]) {
    if (!Number.isFinite(input[field]) || input[field] <= 0 || input[field] > limits[field]) throw new RangeError(`Invalid ${field}`);
  }
  if (!Number.isInteger(input.employees) || !Number.isFinite(input.efficiencyGain) || input.efficiencyGain < 0 || input.efficiencyGain > 1) throw new RangeError('Invalid employees or efficiencyGain');
  const monthlyHoursCurrent = input.employees * input.hoursPerWeek * WEEKS_PER_MONTH;
  const monthlyHoursSaved = monthlyHoursCurrent * input.efficiencyGain;
  const monthlyValueSaved = monthlyHoursSaved * input.hourlyCost;
  return { monthlyHoursCurrent, monthlyHoursSaved, monthlyValueSaved, annualValueSaved: monthlyValueSaved * 12 };
}

