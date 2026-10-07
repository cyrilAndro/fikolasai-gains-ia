import { afterEach, expect, it, vi } from 'vitest';
import { configureAnalytics, trackCalculatorStarted, trackCalculationCompleted, trackCtaClicked } from './analytics';
afterEach(() => configureAnalytics());
it('permet une intégration neutre sans transmettre la saisie', () => {
  const handler = vi.fn(); configureAnalytics(handler);
  trackCalculatorStarted(); trackCalculationCompleted(); trackCtaClicked();
  expect(handler.mock.calls).toEqual([['calculator_started'], ['calculation_completed'], ['cta_clicked']]);
});
it('isole une panne du fournisseur de mesure', () => {
  configureAnalytics(() => { throw new Error('offline'); });
  expect(trackCtaClicked).not.toThrow();
});
