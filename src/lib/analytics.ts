// Optional local integration point. No provider, network request or input data.
export type CalculatorEvent = 'calculator_started' | 'calculation_completed' | 'cta_clicked';
let handler: ((event: CalculatorEvent) => void) | undefined;
export function configureAnalytics(next?: typeof handler) { handler = next; }
function track(event: CalculatorEvent) {
  try { handler?.(event); } catch { /* Analytics must never interrupt a simulation. */ }
}
export const trackCalculatorStarted = () => track('calculator_started');
export const trackCalculationCompleted = () => track('calculation_completed');
export const trackCtaClicked = () => track('cta_clicked');
