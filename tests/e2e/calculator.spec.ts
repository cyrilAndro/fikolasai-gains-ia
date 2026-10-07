import { expect, test, type Page } from '@playwright/test';
async function example(page: Page) {
  await page.getByLabel('Quelle tâche répétitive voulez-vous améliorer ?').fill('Comptes rendus de réunion');
  await page.getByLabel('Combien de personnes ?').fill('10');
  await page.getByLabel('Quel temps par personne ?').fill('2');
}
test('simulation immédiate, hypothèses, reset, contact et données héritées', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await page.addInitScript(() => localStorage.setItem('fikolasai:gains-ia:draft:v1', 'legacy-preserved'));
  await page.goto('./'); await example(page);
  expect(await page.locator('.calculator input:not([type="radio"])').evaluateAll(inputs => inputs.length === 4 && inputs.every(input => input.getAttribute('data-clarity-mask') === 'true'))).toBe(true);
  await expect(page.getByTestId('hours').locator('xpath=ancestor::div[@aria-live]')).toHaveAttribute('data-clarity-mask', 'true');
  await expect(page.getByTestId('hours')).toHaveText('26 h');
  await expect(page.getByTestId('monthly')).toHaveText('909 €');
  await expect(page.getByTestId('annual')).toHaveText('10 912 €');
  await page.getByRole('radio', { name: 'Prudent 20 %' }).check();
  await expect(page.getByTestId('hours')).toHaveText('17 h');
  await page.getByRole('radio', { name: 'Potentiel élevé 50 %' }).check();
  await expect(page.getByTestId('hours')).toHaveText('43 h');
  await expect(page.getByRole('link', { name: 'Identifier mes opportunités IA' })).toHaveAttribute('href', /^mailto:cyril\.fikolasai@gmail\.com\?subject=/);
  await page.getByRole('button', { name: 'Faire une autre simulation' }).click();
  await expect(page.getByLabel('Quelle tâche répétitive voulez-vous améliorer ?')).toBeFocused();
  await expect(page.getByLabel('Quel temps par personne ?')).toHaveValue('');
  await expect(page.getByRole('radio', { name: 'Réaliste 30 %' })).toBeChecked();
  await expect(page.locator('[aria-invalid=true]')).toHaveCount(0);
  await expect(page.getByTestId('hours')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('fikolasai:gains-ia:draft:v1'))).toBe('legacy-preserved');
  expect(errors).toEqual([]);
});
test('erreurs locales, virgules, petits montants et grandes valeurs', async ({ page }) => {
  await page.goto('./'); await example(page);
  for (const value of ['0', '-1', 'Infinity', 'NaN', '169']) {
    await page.getByLabel('Quel temps par personne ?').fill(value);
    await page.getByLabel('Quel temps par personne ?').press('Tab');
    await expect(page.getByLabel('Quel temps par personne ?')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('hours')).toHaveCount(0);
  }
  await page.getByLabel('Quel temps par personne ?').fill('2,5');
  await expect(page.getByTestId('hours')).toHaveText('32 h');
  await page.getByLabel('Combien de personnes ?').fill('1,5');
  await page.getByLabel('Combien de personnes ?').press('Tab');
  await expect(page.getByText('Saisissez un nombre entier de personnes.')).toBeVisible();
  await page.getByLabel('Combien de personnes ?').fill('1');
  await page.getByLabel('Quel temps par personne ?').fill('0,01');
  await page.getByLabel('Quel coût horaire par personne ?').fill('0,01');
  await expect(page.getByTestId('hours')).toHaveText('< 1 h');
  await expect(page.getByTestId('monthly')).toHaveText('< 1 €');
  await page.getByLabel('Combien de personnes ?').fill('100000');
  await page.getByLabel('Quel temps par personne ?').fill('168');
  await page.getByLabel('Quel coût horaire par personne ?').fill('100000');
  await expect(page.getByTestId('annual')).not.toContainText(/NaN|Infinity/);
});
test('navigation au clavier et sélection native des hypothèses', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'FikolasAI, accueil' })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Français', exact: true })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'English', exact: true })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Quelle tâche répétitive voulez-vous améliorer ?')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Emails', exact: true })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByLabel('Quelle tâche répétitive voulez-vous améliorer ?')).toHaveValue('Emails');
  for (let index = 0; index < 9; index++) await page.keyboard.press('Tab');
  await expect(page.getByRole('radio', { name: 'Réaliste 30 %' })).toBeFocused();
  await page.keyboard.press('ArrowRight'); await expect(page.getByRole('radio', { name: 'Potentiel élevé 50 %' })).toBeChecked();
  await page.keyboard.press('Tab');
  const disclosure = page.locator('summary');
  await expect(disclosure).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('details')).toHaveAttribute('open', '');
  await page.keyboard.press('Enter'); await expect(page.locator('details')).not.toHaveAttribute('open', '');
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Identifier mes opportunités IA' })).toBeFocused();
  const outline = await page.getByRole('link', { name: 'Identifier mes opportunités IA' }).evaluate(element => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe('none');
});
for (const width of [375, 430, 768, 1440]) {
  test(`responsive ${width}px sans débordement`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('./'); await example(page);
    await expect(page.getByRole('link', { name: 'Identifier mes opportunités IA' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('radio', { name: 'Potentiel élevé 50 %' }).check();
    await expect(page.locator('#gain-description')).toContainText('Hypothèse haute');
    await page.getByRole('radio', { name: 'Réaliste 30 %' }).check();
    await page.screenshot({ path: `docs/images/simple-${width}.png`, fullPage: true });
    await page.locator('summary').click();
    await expect(page.getByRole('link', { name: /NBER/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByLabel('Combien de personnes ?').fill('100000');
    await page.getByLabel('Quel temps par personne ?').fill('168');
    await page.getByLabel('Quel coût horaire par personne ?').fill('100000');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('réassurance cohérente avec la saisie et sources accessibles à la demande', async ({ page }) => {
  await page.goto('./'); await example(page);
  const summary = page.getByRole('group', { name: 'Données utilisées' });
  await expect(summary).toContainText('10 personnes');
  await expect(summary).toContainText('2 h/semaine par personne');
  await expect(summary).toContainText('35 €/h');
  await expect(summary).toContainText('Hypothèse de gain : 30 %');
  await expect(page.getByText('Estimation indicative', { exact: true })).toBeVisible();
  await expect(page.locator('.capacity-note')).toContainText('909 € de trésorerie');
  await page.getByLabel('Quel temps par personne ?').fill('2,75');
  await page.getByLabel('Quel coût horaire par personne ?').fill('40,50');
  await expect(summary).toContainText('2,75 h/semaine par personne');
  await expect(summary).toContainText('40,5 €/h');
  for (const [name, description, rate] of [['Prudent 20 %', 'Hypothèse prudente', '20'], ['Potentiel élevé 50 %', 'Hypothèse haute', '50'], ['Réaliste 30 %', 'Hypothèse intermédiaire', '30']]) {
    await page.getByRole('radio', { name }).check();
    await expect(page.locator('#gain-description')).toContainText(description);
    await expect(summary).toContainText(`Hypothèse de gain : ${rate} %`);
  }
  await expect(page.getByRole('link', { name: /NBER/ })).not.toBeVisible();
  await page.locator('summary').click();
  await expect(page.locator('.research-content')).toContainText('ces études ne prouvent pas un gain universel');
  for (const [name, url] of [['NBER', 'https://www.nber.org/papers/w31161'], ['Harvard', 'https://aiinstitute.hbs.edu/navigating-the-jagged-technological-frontier/'], ['Microsoft', 'https://www.microsoft.com/en-us/research/wp-content/uploads/2023/12/AI-and-Productivity-Report-First-Edition.pdf']]) {
    const link = page.getByRole('link', { name: new RegExp(name) });
    await expect(link).toHaveAttribute('href', url);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.getByLabel('Quel temps par personne ?').fill('');
  await expect(summary).toHaveCount(0);
  await expect(page.locator('.capacity-note')).toHaveCount(0);
});

test('anglais complet, changement sans perte, préférence et lien partageable', async ({ page }) => {
  await page.goto('./'); await example(page);
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByLabel('Which repetitive task would you like to improve?')).toHaveValue('Comptes rendus de réunion');
  await expect(page.getByTestId('monthly')).toHaveText('€909');
  await expect(page.getByTestId('annual')).toHaveText('€10,912');
  await expect(page.locator('.capacity-note')).toContainText('€909 in cash savings');
  await expect(page.getByRole('group', { name: 'Inputs used' })).toContainText('2 h/week per person');
  await expect(page.getByRole('link', { name: 'Explore my AI opportunities' })).toHaveAttribute('href', /subject=Explore/);
  await page.getByLabel('How much time per person?').fill('169');
  await page.getByLabel('How much time per person?').press('Tab');
  await expect(page.getByText('Maximum: 168 hours per week.')).toBeVisible();
  await page.getByRole('button', { name: 'Français', exact: true }).click();
  await expect(page.getByText('Maximum : 168 heures par semaine.')).toBeVisible();
  await page.goto('./?lang=en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Start another simulation' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

for (const lang of ['fr', 'en']) for (const width of [360, 390]) {
  test(`bilingue ${lang} ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`./?lang=${lang}`);
    await page.locator('.fields input').nth(1).fill('2');
    await page.locator('summary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `docs/images/bilingual-${lang}-${width}.png`, fullPage: true });
  });
}
test.describe('langue du navigateur', () => {
  test.use({ locale: 'en-US' });
  test('anglais automatique et priorité au lien français', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('get back with AI?');
    await page.goto('./?lang=fr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });
});
