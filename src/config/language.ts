export type Language = 'fr' | 'en';
export const english: Record<string, string> = {
  'FikolasAI, accueil': 'FikolasAI, home',
  'Du temps pour l’essentiel.': 'More time for what matters.',
  'VOTRE POTENTIEL IA · EN 1 MINUTE': 'YOUR AI POTENTIAL · IN 1 MINUTE',
  'Combien de temps votre équipe pourrait-elle ': 'How much time could your team ',
  'récupérer grâce à l’IA ?': 'get back with AI?',
  'Une tâche répétitive. Quatre réponses. Une estimation du temps et de la valeur que vous pourriez récupérer.': 'One repetitive task. Four answers. An estimate of the time and value you could recover.',
  'Votre simulation': 'Your simulation',
  'Ajustez les valeurs pour refléter votre situation réelle.': 'Adjust the values to reflect your own situation.',
  'Quelle tâche répétitive voulez-vous améliorer ?': 'Which repetitive task would you like to improve?',
  'Ex. : rédaction d’emails, comptes rendus…': 'E.g. writing emails, meeting notes…',
  'Le nom est facultatif et ne modifie pas le calcul.': 'The task name is optional and does not affect the calculation.',
  'Suggestions de tâches': 'Task suggestions',
  'Emails': 'Emails', 'Comptes rendus': 'Meeting notes', 'Reporting': 'Reporting',
  'Analyse de documents': 'Document analysis', 'Préparation commerciale': 'Sales preparation', 'Support client': 'Customer support',
  'Combien de personnes ?': 'How many people?', 'personnes': 'people', 'personne': 'person',
  'Ex. : 5': 'E.g. 5', 'Celles qui réalisent cette tâche.': 'People who regularly perform this task.',
  'Quel temps par personne ?': 'How much time per person?', 'h / semaine': 'h / week', 'Ex. : 3': 'E.g. 3',
  'Le temps consacré à cette tâche chaque semaine.': 'Time spent on this task each week.',
  'Quel coût horaire par personne ?': 'What is the hourly cost per person?', 'Ex. : 35': 'E.g. 35',
  'Salaire + charges. 35 € est un exemple modifiable.': 'Salary + employer costs. €35 is an editable example.',
  'Hypothèse de gain de temps': 'Assumed time saving',
  'Prudent': 'Conservative', 'Réaliste': 'Realistic', 'Potentiel élevé': 'High potential',
  'Hypothèse prudente pour une première estimation.': 'A conservative assumption for an initial estimate.',
  'Hypothèse intermédiaire pour une tâche où l’IA peut assister une partie significative du travail.': 'A middle-range assumption for a task where AI can assist with a significant part of the work.',
  'Hypothèse haute, surtout pertinente pour des tâches répétitives et fortement automatisables.': 'A high assumption, most relevant to repetitive tasks with strong automation potential.',
  'Le gain dépend de la tâche : il peut être important sur des tâches très répétitives et fortement assistables par l’IA, plus modéré sur d’autres. Ces taux sont des hypothèses, pas des moyennes observées.': 'Savings depend on the task: they may be substantial for highly repetitive work well suited to AI assistance, and more modest for other tasks. These rates are assumptions, not observed averages.',
  'Votre potentiel estimé': 'Your estimated potential', 'Estimation indicative': 'Indicative estimate',
  'potentiellement récupérées / mois': 'potentially recovered / month',
  'de valeur de temps potentiellement récupérée / mois': 'in potential value of recovered time / month',
  'Soit ': 'Equivalent to ', ' de temps de travail valorisé par an.': ' in working-time value per year.',
  'Cela ne signifie pas nécessairement ': 'This does not necessarily mean ',
  ' de trésorerie économisée par mois. Il s’agit de la valeur du temps de travail potentiellement libéré, avant les coûts de mise en œuvre.': ' in cash savings per month. It is the value of working time potentially freed up, before implementation costs.',
  'Données utilisées': 'Inputs used', ' h/semaine par personne': ' h/week per person', 'Hypothèse de gain : ': 'Assumed saving: ',
  'Votre équipe consacre environ ': 'Your team currently spends around ', ' par mois': ' per month', ' à ': ' on ',
  'cette tâche': 'this task', '. Avec une réduction de ': '. With a reduction of ', ' %, environ ': '%, around ',
  ' pourraient être réaffectées à des activités à plus forte valeur ajoutée.': ' could be redirected towards higher-value activities.',
  'Renseignez les trois valeurs ci-dessus pour découvrir votre potentiel. Le résultat s’actualise automatiquement.': 'Enter the three values above to discover your potential. Results update automatically.',
  'Comment ce résultat est-il calculé ?': 'How is this result calculated?',
  'Personnes × heures par semaine × 4,33 semaines × gain de temps estimé.': 'People × hours per week × 4.33 weeks × assumed time saving.',
  'La valeur économique correspond au temps potentiellement récupéré multiplié par le coût horaire indiqué. La valeur annuelle correspond à 12 mois ; seuls les résultats affichés sont arrondis.': 'The economic value is the time potentially recovered multiplied by the hourly cost entered. The annual value covers 12 months; only displayed results are rounded.',
  'Les gains réels dépendent du niveau d’automatisation possible, de la qualité des processus existants, des outils utilisés et de l’adoption par les équipes.': 'Actual savings depend on what can be automated, the quality of existing processes, the tools used and team adoption.',
  'Sur quoi reposent ces hypothèses ?': 'What informs these assumptions?',
  'Les gains de productivité observés avec l’IA varient fortement selon les tâches et les métiers. Les taux de 20 %, 30 % et 50 % sont des choix de simulation : ces études ne prouvent pas un gain universel à ces niveaux. Une hausse de productivité n’équivaut pas directement à la même réduction du temps de travail.': 'Observed AI productivity gains vary widely across tasks and occupations. The 20%, 30% and 50% rates are simulation choices: these studies do not establish universal gains at those levels. A productivity increase does not directly translate into an equal reduction in working time.',
  ' (nouvel onglet)': ' (new tab)',
  'NBER · Assistance IA dans le support client': 'NBER · AI assistance in customer support',
  'Generative AI at Work (2023). Des effets différents selon l’expérience des agents, dans une entreprise de support client.': 'Generative AI at Work (2023). Effects varied with agent experience within one customer-support company.',
  'Harvard / BCG · Travail de consultants': 'Harvard / BCG · Consultants’ work',
  'Étude de 2023 : des améliorations sur certaines tâches, mais aussi des erreurs plus fréquentes sur une tâche au-delà des capacités de l’IA.': '2023 study: improvements on some tasks, but also more frequent errors on a task beyond the AI’s capabilities.',
  'Microsoft Research · Premiers travaux sur Copilot': 'Microsoft Research · Early Copilot research',
  'Rapport de 2023 (PDF, en anglais), réalisé par l’éditeur : premiers résultats sur des tâches ciblées, sans mesurer la productivité globale de tous les métiers.': '2023 report (PDF, in English), produced by the vendor: early findings on selected tasks, not a measure of overall productivity across all occupations.',
  'Et si on vérifiait ce potentiel dans votre entreprise ?': 'What if we explored this potential in your business?',
  'Cette estimation donne un ordre de grandeur. L’étape suivante : analyser ensemble vos processus réels pour identifier les cas d’usage réellement pertinents.': 'This estimate gives you a sense of scale. The next step: look at your actual processes together to identify the use cases that make sense for your business.',
  'Identifier mes opportunités IA': 'Explore my AI opportunities',
  'Faire une autre simulation': 'Start another simulation',
  'Sans compte. Vos réponses restent dans cette page.': 'No account needed. Your answers stay on this page.',
  'Renseignez ce champ pour voir votre estimation.': 'Complete this field to see your estimate.',
  'Saisissez un nombre supérieur à 0.': 'Enter a number greater than 0.',
  'Saisissez un nombre entier de personnes.': 'Enter a whole number of people.',
};
export function translate(language: Language, text: string) { return language === 'en' ? english[text] ?? text : text; }
export function detectLanguage(): Language {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (query === 'fr' || query === 'en') return query;
  try { const saved = localStorage.getItem('fikolasai:language'); if (saved === 'fr' || saved === 'en') return saved; } catch { /* Storage may be disabled. */ }
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
}
export function rememberLanguage(language: Language) {
  const url = new URL(window.location.href); url.searchParams.set('lang', language);
  window.history.replaceState(null, '', url);
  try { localStorage.setItem('fikolasai:language', language); } catch { /* Preference still works during this visit. */ }
}
