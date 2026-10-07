import { useEffect, useRef, useState } from 'react';
import { detectLanguage, rememberLanguage, translate, type Language } from './config/language';
import { Field } from './components/Field';
import { brand, CTA_URL, DEFAULT_GAIN, GAIN_OPTIONS, TASK_SUGGESTIONS } from './config/brand';
import { RESEARCH_SOURCES } from './config/sources';
import { calculateSavings, parseInput, type NumericField } from './domain/calculations';
import { trackCalculatorStarted, trackCalculationCompleted, trackCtaClicked } from './lib/analytics';
const initialValues = { employees: '1', hoursPerWeek: '', hourlyCost: '35' };

export default function App() {
  const [language, setLanguage] = useState<Language>(detectLanguage);
  const t = (text: string) => translate(language, text);
  const locale = language === 'fr' ? 'fr-FR' : 'en-GB';
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const inputNumber = new Intl.NumberFormat(locale, { maximumFractionDigits: 16 });
  function estimate(value: number, unit: string) {
    if (value > 0 && value < 1) return language === 'en' && unit === '€' ? '< €1' : '< 1 ' + unit;
    return language === 'en' && unit === '€' ? '€' + number.format(value) : number.format(value) + ' ' + unit;
  }
  function switchLanguage(next: Language) { rememberLanguage(next); setLanguage(next); }
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'fr' ? 'Calculateur IA : combien de temps votre entreprise peut-elle gagner ? | FikolasAI' : 'AI calculator: how much time could your team recover? | FikolasAI';
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'fr' ? 'Estimez en moins d’une minute combien de temps et de valeur votre équipe pourrait récupérer grâce à l’intelligence artificielle.' : 'Estimate in under a minute how much time and value your team could recover with AI. Transparent assumptions, no account needed.');
  }, [language]);
  const [task, setTask] = useState('');
  const [values, setValues] = useState(initialValues);
  const [gain, setGain] = useState(DEFAULT_GAIN);
  const [resetKey, setResetKey] = useState(0);
  const taskInput = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const completed = useRef(false);
  const parsed = { employees: parseInput(values.employees, 'employees', language), hoursPerWeek: parseInput(values.hoursPerWeek, 'hoursPerWeek', language), hourlyCost: parseInput(values.hourlyCost, 'hourlyCost', language) };
  const valid = Object.values(parsed).every(field => !field.error);
  const result = valid ? calculateSavings({ employees: parsed.employees.value, hoursPerWeek: parsed.hoursPerWeek.value, hourlyCost: parsed.hourlyCost.value, efficiencyGain: gain }) : null;
  useEffect(() => {
    if (!started.current) { started.current = true; trackCalculatorStarted(); }
  }, []);
  useEffect(() => {
    if (valid && !completed.current) { completed.current = true; trackCalculationCompleted(); }
  }, [valid]);
  function change(field: NumericField, value: string) { setValues(previous => ({ ...previous, [field]: value })); }
  function reset() {
    setTask(''); setValues(initialValues); setGain(DEFAULT_GAIN); setResetKey(key => key + 1);
    completed.current = false; taskInput.current?.focus();
  }
  return <>
    <header className="site-header"><a href={brand.website} aria-label={t("FikolasAI, accueil")}>Fikolas<span>AI</span><span className="brand-dot" aria-hidden="true"/></a><div className="header-tools"><span>{t("Du temps pour l’essentiel.")}</span><nav className="language-switch" aria-label="Language / Langue"><button type="button" lang="fr" aria-label="Français" aria-pressed={language === 'fr'} onClick={() => switchLanguage('fr')}>FR</button><button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => switchLanguage('en')}>EN</button></nav></div></header>
    <main>
      <section className="intro" aria-labelledby="title"><p className="eyebrow">{t("VOTRE POTENTIEL IA · EN 1 MINUTE")}</p>
        <h1 id="title">{t("Combien de temps votre équipe pourrait-elle ")}<em>{t("récupérer grâce à l’IA ?")}</em></h1>
        <p>{t("Une tâche répétitive. Quatre réponses. Une estimation du temps et de la valeur que vous pourriez récupérer.")}</p>
      </section>
      <section className="calculator" aria-label={t("Votre simulation")}>
        <p className="control-note">{t("Ajustez les valeurs pour refléter votre situation réelle.")}</p>
        <div className="task-field"><label htmlFor="task">{t("Quelle tâche répétitive voulez-vous améliorer ?")}</label>
          <input ref={taskInput} id="task" maxLength={120} value={task} onChange={e => setTask(e.target.value)} placeholder={t("Ex. : rédaction d’emails, comptes rendus…")} aria-describedby="task-help"/>
          <span id="task-help" className="sr-only">{t("Le nom est facultatif et ne modifie pas le calcul.")}</span>
          <div className="suggestions" aria-label={t("Suggestions de tâches")}>{TASK_SUGGESTIONS.map(suggestion => <button type="button" key={suggestion} aria-pressed={task === t(suggestion)} onClick={() => setTask(t(suggestion))}>{t(suggestion)}</button>)}</div>
        </div>
        <div className="fields" key={resetKey}>
          <Field label={t("Combien de personnes ?")} value={values.employees} onChange={value => change('employees', value)} error={parsed.employees.error} unit={t("personnes")} placeholder={t("Ex. : 5")} hint={t("Celles qui réalisent cette tâche.")} integer/>
          <Field label={t("Quel temps par personne ?")} value={values.hoursPerWeek} onChange={value => change('hoursPerWeek', value)} error={parsed.hoursPerWeek.error} unit={t("h / semaine")} placeholder={t("Ex. : 3")} hint={t("Le temps consacré à cette tâche chaque semaine.")}/>
          <Field label={t("Quel coût horaire par personne ?")} value={values.hourlyCost} onChange={value => change('hourlyCost', value)} error={parsed.hourlyCost.error} unit={t("€ / h")} placeholder={t("Ex. : 35")} hint={t("Salaire + charges. 35 € est un exemple modifiable.")}/>
        </div>
        <fieldset className="gain" aria-describedby="gain-description gain-context"><legend>{t("Hypothèse de gain de temps")}</legend>
          <div className="gain-options">{GAIN_OPTIONS.map(option => <label key={option.value}><input type="radio" name="gain" value={option.value} checked={gain === option.value} onChange={() => setGain(option.value)}/><span>{t(option.label)} <strong>{option.value * 100} %</strong></span></label>)}</div>
          <p id="gain-description" className="gain-description" aria-live="polite">{t(GAIN_OPTIONS.find(option => option.value === gain)?.description ?? '')}</p>
          <p id="gain-context">{t("Le gain dépend de la tâche : il peut être important sur des tâches très répétitives et fortement assistables par l’IA, plus modéré sur d’autres. Ces taux sont des hypothèses, pas des moyennes observées.")}</p>
        </fieldset>
      </section>
      <section className={`results ${result ? 'ready' : ''}`} aria-labelledby="result-title">
        <div className="result-heading"><h2 id="result-title">{t("Votre potentiel estimé")}</h2><span className="estimate-badge">{t("Estimation indicative")}</span></div>
        <div aria-live="polite" aria-atomic="true">
          {result ? <>
            <div className="metrics"><div><strong data-testid="hours">{estimate(result.monthlyHoursSaved, 'h')}</strong><span>{t("potentiellement récupérées / mois")}</span></div><div><strong data-testid="monthly">{estimate(result.monthlyValueSaved, '€')}</strong><span>{t("de valeur de temps potentiellement récupérée / mois")}</span></div></div>
            <p className="annual">{t("Soit ")}<strong data-testid="annual">{estimate(result.annualValueSaved, '€')}</strong>{t(" de temps de travail valorisé par an.")}</p>
            <p className="capacity-note">{t("Cela ne signifie pas nécessairement ")}{estimate(result.monthlyValueSaved, '€')}{t(" de trésorerie économisée par mois. Il s’agit de la valeur du temps de travail potentiellement libéré, avant les coûts de mise en œuvre.")}</p>
            <div className="simulation-summary" role="group" aria-label={t("Données utilisées")}>
              <p>{t("Votre simulation")}</p>
              <ul><li>{inputNumber.format(parsed.employees.value)} {t(parsed.employees.value === 1 ? 'personne' : 'personnes')}</li><li>{inputNumber.format(parsed.hoursPerWeek.value)}{t(" h/semaine par personne")}</li><li>{inputNumber.format(parsed.hourlyCost.value)} €/h</li><li>{t("Hypothèse de gain : ")}{gain * 100} %</li></ul>
            </div>
            <p className="context">{t("Votre équipe consacre environ ")}<strong>{estimate(result.monthlyHoursCurrent, 'h')}{t(" par mois")}</strong>{t(" à ")}{task.trim() ? <>« {task.trim()} »</> : t('cette tâche')}{t(". Avec une réduction de ")}{gain * 100}{t(" %, environ ")}<strong>{estimate(result.monthlyHoursSaved, 'h')}</strong>{t(" pourraient être réaffectées à des activités à plus forte valeur ajoutée.")}</p>
          </> : <p className="empty-result">{t("Renseignez les trois valeurs ci-dessus pour découvrir votre potentiel. Le résultat s’actualise automatiquement.")}</p>}
        </div>
        <div className="calculation-explanation"><h3>{t("Comment ce résultat est-il calculé ?")}</h3>
          <p>{t("Personnes × heures par semaine × 4,33 semaines × gain de temps estimé.")}</p>
          <p>{t("La valeur économique correspond au temps potentiellement récupéré multiplié par le coût horaire indiqué. La valeur annuelle correspond à 12 mois ; seuls les résultats affichés sont arrondis.")}</p>
        </div>
        <p className="credibility-note">{t("Les gains réels dépendent du niveau d’automatisation possible, de la qualité des processus existants, des outils utilisés et de l’adoption par les équipes.")}</p>
        <details className="research"><summary>{t("Sur quoi reposent ces hypothèses ?")}</summary>
          <div className="research-content"><p>{t("Les gains de productivité observés avec l’IA varient fortement selon les tâches et les métiers. Les taux de 20 %, 30 % et 50 % sont des choix de simulation : ces études ne prouvent pas un gain universel à ces niveaux. Une hausse de productivité n’équivaut pas directement à la même réduction du temps de travail.")}</p>
            <ul>{RESEARCH_SOURCES.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{t(source.title)}<span className="sr-only">{t(" (nouvel onglet)")}</span><span aria-hidden="true"> ↗</span></a><p>{t(source.context)}</p></li>)}</ul>
          </div>
        </details>
      </section>
      <section className="contact" aria-labelledby="contact-title"><div><h2 id="contact-title">{t("Et si on vérifiait ce potentiel dans votre entreprise ?")}</h2><p>{t("Cette estimation donne un ordre de grandeur. L’étape suivante : analyser ensemble vos processus réels pour identifier les cas d’usage réellement pertinents.")}</p><p className="signature">Cyril Cieslak · FikolasAI</p></div><div className="contact-actions"><a className="primary" href={language === 'en' && CTA_URL.startsWith('mailto:') ? CTA_URL.replace(/([?&]subject=)[^&]*/, '$1Explore%20my%20AI%20opportunities') : CTA_URL} onClick={trackCtaClicked}>{t("Identifier mes opportunités IA")}<span aria-hidden="true">↗</span></a><button type="button" className="reset" onClick={reset}>{t("Faire une autre simulation")}</button></div></section>
    </main><footer>FikolasAI <span>{t("Sans compte. Vos réponses restent dans cette page.")}</span></footer>
  </>;
}

