import { useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { ALLERGENS, BUDGET_STEPS, CALORIE_STEPS, DIET_PROFILES } from '../data/guide.js';
import { addSpend, daysLeftInWeek, spentThisWeek, weekKey } from '../lib/budget.js';
import { yen } from '../lib/recipe.js';

function Stepper({ value, options, onChange, format, label }) {
  const idx = Math.max(0, options.indexOf(value));
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <button className="icon-btn" onClick={() => onChange(options[Math.max(0, idx - 1)])} disabled={idx === 0} aria-label={`Lower ${label}`}><Minus size={16} /></button>
      <b style={{ fontFamily: 'var(--serif)', fontSize: 26 }} aria-live="polite">{format(options[idx])}</b>
      <button className="icon-btn" onClick={() => onChange(options[Math.min(options.length - 1, idx + 1)])} disabled={idx === options.length - 1} aria-label={`Raise ${label}`}><Plus size={16} /></button>
    </div>
  );
}

export default function ProfileView({ settings, setSettings, spendLog, setSpendLog }) {
  const [custom, setCustom] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));
  const toggleAllergy = (a) => set({ allergies: settings.allergies.includes(a) ? settings.allergies.filter((x) => x !== a) : [...settings.allergies, a] });
  const knownCats = new Set(ALLERGENS.map((a) => a.cat));
  const customAllergies = settings.allergies.filter((a) => !knownCats.has(a));

  const spent = spentThisWeek(spendLog);
  const left = settings.weeklyBudget - spent;
  const days = daysLeftInWeek();
  const thisWeek = spendLog.filter((e) => e.week === weekKey());

  return (
    <div className="stack">
      <div className="card">
        <p className="eyebrow">This week</p>
        <div className="row" style={{ alignItems: 'baseline' }}>
          <h2 className="grow" style={{ fontSize: 28, color: left < 0 ? 'var(--bad)' : 'var(--ink)' }}>{yen(Math.abs(left))}</h2>
          <span className="small muted">{left < 0 ? 'over budget' : 'left'} · {yen(spent)} spent</span>
        </div>
        <div className={`meter ${left < 0 ? 'over' : ''}`} style={{ height: 6, margin: '8px 0' }}>
          <i style={{ width: `${Math.min(100, (spent / settings.weeklyBudget) * 100)}%` }} />
        </div>
        <p className="small muted">{left > 0 ? `About ${yen(left / days)} a day for the next ${days} day${days === 1 ? '' : 's'}.` : 'Rice, eggs, tofu, bean sprouts and frozen veg stretch furthest until Monday.'}</p>
        <form className="row mt" onSubmit={(e) => { e.preventDefault(); setSpendLog((l) => addSpend(l, amount, note)); setAmount(''); setNote(''); }}>
          <input className="input" style={{ width: 110 }} inputMode="numeric" placeholder="¥" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} aria-label="Amount spent" />
          <input className="input grow" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Note" />
          <button className="btn primary" type="submit" disabled={!amount}>Log</button>
        </form>
        {thisWeek.length > 0 && (
          <div className="stack mt" style={{ gap: 4 }}>
            {thisWeek.map((e) => (
              <div key={e.id} className="row small">
                <span className="faint" style={{ width: 70 }}>{new Date(e.at).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</span>
                <span className="grow">{e.note || 'Groceries'}</span>
                <span className="mono">{yen(e.amount)}</span>
                <button className="remove" onClick={() => setSpendLog((l) => l.filter((x) => x.id !== e.id))} aria-label="Delete entry"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <p className="eyebrow">Weekly food budget</p>
        <Stepper label="budget" value={settings.weeklyBudget} options={BUDGET_STEPS} onChange={(v) => set({ weeklyBudget: v })} format={yen} />
        <p className="small muted center mt">≈ {yen(settings.weeklyBudget / 7)} a day · {yen(settings.weeklyBudget / 21)} a meal · {yen((settings.weeklyBudget * 52) / 12)} a month</p>
      </div>

      <div className="card">
        <p className="eyebrow">Daily calories</p>
        <Stepper label="calories" value={settings.calorieGoal} options={CALORIE_STEPS} onChange={(v) => set({ calorieGoal: v })} format={(v) => `${v} kcal`} />
      </div>

      <div className="card">
        <p className="eyebrow">Diet</p>
        <div className="grid-2">
          {DIET_PROFILES.map((d) => (
            <button key={d.id} className="option" aria-pressed={settings.diet === d.id} onClick={() => set({ diet: d.id })}>
              <span className="emo" aria-hidden="true">{d.emoji}</span>
              <span><b>{d.label}</b><small>{d.desc}</small></span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="eyebrow">Allergies</p>
        <p className="small muted mb">Recipes containing these are hidden everywhere, and generated recipes are re-checked on your phone. Always read labels too — the Japanese name is shown so you can find it on packaging.</p>
        <div className="row wrap">
          {ALLERGENS.map((a) => (
            <button key={a.cat} className="chip bad" aria-pressed={settings.allergies.includes(a.cat)} onClick={() => toggleAllergy(a.cat)}>
              {a.label} <small className="ja">{a.ja}</small>
            </button>
          ))}
          {customAllergies.map((a) => (
            <button key={a} className="chip bad" aria-pressed="true" onClick={() => toggleAllergy(a)}>{a} <X size={12} /></button>
          ))}
        </div>
        <form className="row mt" onSubmit={(e) => { e.preventDefault(); const t = custom.trim().slice(0, 40); if (t && !settings.allergies.includes(t)) set({ allergies: [...settings.allergies, t] }); setCustom(''); }}>
          <input className="input grow" placeholder="Other ingredient to avoid, e.g. kiwi" value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Custom allergy" />
          <button className="btn" type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}
