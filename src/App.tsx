import { useEffect, useRef, useState } from 'react';
import { Field } from './components/Field';
import { brand, CTA_URL, DEFAULT_GAIN, GAIN_OPTIONS, TASK_SUGGESTIONS } from './config/brand';
import { RESEARCH_SOURCES } from './config/sources';
import { calculateSavings, parseInput, type NumericField } from './domain/calculations';
import { trackCalculatorStarted, trackCalculationCompleted, trackCtaClicked } from './lib/analytics';
const initialValues = { employees: '1', hoursPerWeek: '', hourlyCost: '35' };
const number = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const inputNumber = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 16 });
function estimate(value: number, unit: string) { return `${value > 0 && value < 1 ? '< 1' : number.format(value)} ${unit}`; }
export default function App() {
  const [task, setTask] = useState('');
  const [values, setValues] = useState(initialValues);
  const [gain, setGain] = useState(DEFAULT_GAIN);
  const [resetKey, setResetKey] = useState(0);
  const taskInput = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const completed = useRef(false);
  const parsed = { employees: parseInput(values.employees, 'employees'), hoursPerWeek: parseInput(values.hoursPerWeek, 'hoursPerWeek'), hourlyCost: parseInput(values.hourlyCost, 'hourlyCost') };
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
    <header className="site-header"><a href={brand.website} aria-label="FikolasAI, accueil">Fikolas<span>AI</span><span className="brand-dot" aria-hidden="true"/></a><span>Du temps pour l’essentiel.</span></header>
    <main>
      <section className="intro" aria-labelledby="title"><p className="eyebrow">VOTRE POTENTIEL IA · EN 1 MINUTE</p>
        <h1 id="title">Combien de temps votre équipe pourrait-elle <em>récupérer grâce à l’IA ?</em></h1>
        <p>Une tâche répétitive. Quatre réponses. Une estimation du temps et de la valeur que vous pourriez récupérer.</p>
      </section>
      <section className="calculator" aria-label="Votre simulation">
        <p className="control-note">Ajustez les valeurs pour refléter votre situation réelle.</p>
        <div className="task-field"><label htmlFor="task">Quelle tâche répétitive voulez-vous améliorer ?</label>
          <input ref={taskInput} id="task" maxLength={120} value={task} onChange={e => setTask(e.target.value)} placeholder="Ex. : rédaction d’emails, comptes rendus…" aria-describedby="task-help"/>
          <span id="task-help" className="sr-only">Le nom est facultatif et ne modifie pas le calcul.</span>
          <div className="suggestions" aria-label="Suggestions de tâches">{TASK_SUGGESTIONS.map(suggestion => <button type="button" key={suggestion} aria-pressed={task === suggestion} onClick={() => setTask(suggestion)}>{suggestion}</button>)}</div>
        </div>
        <div className="fields" key={resetKey}>
          <Field label="Combien de personnes ?" value={values.employees} onChange={value => change('employees', value)} error={parsed.employees.error} unit="personnes" placeholder="Ex. : 5" hint="Celles qui réalisent cette tâche." integer/>
          <Field label="Quel temps par personne ?" value={values.hoursPerWeek} onChange={value => change('hoursPerWeek', value)} error={parsed.hoursPerWeek.error} unit="h / semaine" placeholder="Ex. : 3" hint="Le temps consacré à cette tâche chaque semaine."/>
          <Field label="Quel coût horaire par personne ?" value={values.hourlyCost} onChange={value => change('hourlyCost', value)} error={parsed.hourlyCost.error} unit="€ / h" placeholder="Ex. : 35" hint="Salaire + charges. 35 € est un exemple modifiable."/>
        </div>
        <fieldset className="gain" aria-describedby="gain-description gain-context"><legend>Hypothèse de gain de temps</legend>
          <div className="gain-options">{GAIN_OPTIONS.map(option => <label key={option.value}><input type="radio" name="gain" value={option.value} checked={gain === option.value} onChange={() => setGain(option.value)}/><span>{option.label} <strong>{option.value * 100} %</strong></span></label>)}</div>
          <p id="gain-description" className="gain-description" aria-live="polite">{GAIN_OPTIONS.find(option => option.value === gain)?.description}</p>
          <p id="gain-context">Le gain dépend de la tâche : il peut être important sur des tâches très répétitives et fortement assistables par l’IA, plus modéré sur d’autres. Ces taux sont des hypothèses, pas des moyennes observées.</p>
        </fieldset>
      </section>
      <section className={`results ${result ? 'ready' : ''}`} aria-labelledby="result-title">
        <div className="result-heading"><h2 id="result-title">Votre potentiel estimé</h2><span className="estimate-badge">Estimation indicative</span></div>
        <div aria-live="polite" aria-atomic="true">
          {result ? <>
            <div className="metrics"><div><strong data-testid="hours">{estimate(result.monthlyHoursSaved, 'h')}</strong><span>potentiellement récupérées / mois</span></div><div><strong data-testid="monthly">{estimate(result.monthlyValueSaved, '€')}</strong><span>de valeur de temps potentiellement récupérée / mois</span></div></div>
            <p className="annual">Soit <strong data-testid="annual">{estimate(result.annualValueSaved, '€')}</strong> de temps de travail valorisé par an.</p>
            <p className="capacity-note">Cela ne signifie pas nécessairement {estimate(result.monthlyValueSaved, '€')} de trésorerie économisée par mois. Il s’agit de la valeur du temps de travail potentiellement libéré, avant les coûts de mise en œuvre.</p>
            <div className="simulation-summary" role="group" aria-label="Données utilisées">
              <p>Votre simulation</p>
              <ul><li>{inputNumber.format(parsed.employees.value)} {parsed.employees.value === 1 ? 'personne' : 'personnes'}</li><li>{inputNumber.format(parsed.hoursPerWeek.value)} h/semaine par personne</li><li>{inputNumber.format(parsed.hourlyCost.value)} €/h</li><li>Hypothèse de gain : {gain * 100} %</li></ul>
            </div>
            <p className="context">Votre équipe consacre environ <strong>{estimate(result.monthlyHoursCurrent, 'h')} par mois</strong> à {task.trim() ? <>« {task.trim()} »</> : 'cette tâche'}. Avec une réduction de {gain * 100} %, environ <strong>{estimate(result.monthlyHoursSaved, 'h')}</strong> pourraient être réaffectées à des activités à plus forte valeur ajoutée.</p>
          </> : <p className="empty-result">Renseignez les trois valeurs ci-dessus pour découvrir votre potentiel. Le résultat s’actualise automatiquement.</p>}
        </div>
        <div className="calculation-explanation"><h3>Comment ce résultat est-il calculé ?</h3>
          <p>Personnes × heures par semaine × 4,33 semaines × gain de temps estimé.</p>
          <p>La valeur économique correspond au temps potentiellement récupéré multiplié par le coût horaire indiqué. La valeur annuelle correspond à 12 mois ; seuls les résultats affichés sont arrondis.</p>
        </div>
        <p className="credibility-note">Les gains réels dépendent du niveau d’automatisation possible, de la qualité des processus existants, des outils utilisés et de l’adoption par les équipes.</p>
        <details className="research"><summary>Sur quoi reposent ces hypothèses ?</summary>
          <div className="research-content"><p>Les gains de productivité observés avec l’IA varient fortement selon les tâches et les métiers. Les taux de 20 %, 30 % et 50 % sont des choix de simulation : ces études ne prouvent pas un gain universel à ces niveaux. Une hausse de productivité n’équivaut pas directement à la même réduction du temps de travail.</p>
            <ul>{RESEARCH_SOURCES.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> (nouvel onglet)</span><span aria-hidden="true"> ↗</span></a><p>{source.context}</p></li>)}</ul>
          </div>
        </details>
      </section>
      <section className="contact" aria-labelledby="contact-title"><div><h2 id="contact-title">Et si on vérifiait ce potentiel dans votre entreprise ?</h2><p>Cette estimation donne un ordre de grandeur. L’étape suivante : analyser ensemble vos processus réels pour identifier les cas d’usage réellement pertinents.</p><p className="signature">Cyril Cieslak · FikolasAI</p></div><div className="contact-actions"><a className="primary" href={CTA_URL} onClick={trackCtaClicked}>Identifier mes opportunités IA <span aria-hidden="true">↗</span></a><button type="button" className="reset" onClick={reset}>Faire une autre simulation</button></div></section>
    </main><footer>FikolasAI <span>Sans compte. Vos réponses restent dans cette page.</span></footer>
  </>;
}
