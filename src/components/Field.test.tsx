import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Field } from './Field';
afterEach(cleanup);
it('attend la sortie du champ avant une erreur et accepte la virgule', async () => {
  const change = vi.fn(); render(<Field label="Durée" value="" onChange={change} error="Complétez la durée" hint="Par personne" unit="h / semaine" placeholder="Ex. : 2"/>);
  const input = screen.getByLabelText('Durée'); expect(input.getAttribute('aria-invalid')).toBe('false');
  await userEvent.type(input, ','); expect(change).toHaveBeenCalledWith(',');
  await userEvent.tab(); expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(screen.getByText('Complétez la durée')).toBeTruthy();
  expect(input.getAttribute('aria-describedby')).toContain('help');
});
