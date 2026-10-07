export const brand = { name: 'FikolasAI', creator: 'Cyril Cieslak', website: 'https://fikolasai.com' };
// Replace with your contact page or booking URL when ready.
export const CTA_URL = 'mailto:cyril.fikolasai@gmail.com?subject=Identifier%20mes%20opportunit%C3%A9s%20IA';
export const GAIN_OPTIONS = [
  { label: 'Prudent', value: 0.2, description: 'Hypothèse prudente pour une première estimation.' },
  { label: 'Réaliste', value: 0.3, description: 'Hypothèse intermédiaire pour une tâche où l’IA peut assister une partie significative du travail.' },
  { label: 'Potentiel élevé', value: 0.5, description: 'Hypothèse haute, surtout pertinente pour des tâches répétitives et fortement automatisables.' },
] as const;
export const DEFAULT_GAIN = 0.3;
export const TASK_SUGGESTIONS = ['Emails', 'Comptes rendus', 'Reporting', 'Analyse de documents', 'Préparation commerciale', 'Support client'];
