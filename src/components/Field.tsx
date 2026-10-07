import { useId, useState } from 'react';
export function Field({ label, value, onChange, error, hint, unit, placeholder, integer = false }: {
  label: string; value: string; onChange: (value: string) => void; error?: string;
  hint: string; unit: string; placeholder: string; integer?: boolean;
}) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const displayedError = touched ? error : undefined;
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <div className="input-wrap"><input id={id} type="text" data-clarity-mask="true" inputMode={integer ? 'numeric' : 'decimal'} maxLength={16}
      value={value} placeholder={placeholder} onBlur={() => setTouched(true)} onChange={e => onChange(e.target.value)}
      aria-invalid={!!displayedError} aria-describedby={`${id}-help ${id}-unit`}/>
      <span id={`${id}-unit`}>{unit}</span></div>
    <small id={`${id}-help`} className={displayedError ? 'error' : ''} aria-live="polite">{displayedError || hint}</small>
  </div>;
}
