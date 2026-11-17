import { useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { ALLERGENS, BUDGET_STEPS, CALORIE_STEPS, DIET_PROFILES } from '../data/guide.js';
import { addSpend, daysLeftInWeek, spentThisWeek, weekKey } from '../lib/budget.js';
import { yen } from '../lib/recipe.js';
import { useI18n } from '../i18n/index.jsx';

function Stepper({ value, options, onChange, format, label }) {
  const { t } = useI18n();
  const idx = Math.max(0, options.indexOf(value));
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <button className="icon-btn" onClick={() => onChange(options[Math.max(0, idx - 1)])} disabled={idx === 0} aria-label={`${t('lower')} ${label}`}><Minus size={16} /></button>
      <b style={{ fontFamily: 'var(--serif)', fontSize: 26 }} aria-live="polite">{format(options[idx])}</b>
      <button className="icon-btn" onClick={() => onChange(options[Math.min(options.length - 1, idx + 1)])} disabled={idx === options.length - 1} aria-label={`${t('raise')} ${label}`}><Plus size={16} /></button>
    </div>
  );
}

export default function ProfileView({ settings, setSettings, spendLog, setSpendLog }) {
  const { t, tg } = useI18n();
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
        <p className="eyebrow">{t('thisWeek')}</p>
        <div className="row" style={{ alignItems: 'baseline' }}>
          <h2 className="grow" style={{ fontSize: 28, color: left < 0 ? 'var(--bad)' : 'var(--ink)' }}>{yen(Math.abs(left))}</h2>
          <span className="small muted">{left < 0 ? t('overBudget') : t('left')} · {yen(spent)} {t('spent')}</span>
        </div>
        <div className={`meter ${left < 0 ? 'over' : ''}`} style={{ height: 6, margin: '8px 0' }}>
          <i style={{ width: `${Math.min(100, (spent / settings.weeklyBudget) * 100)}%` }} />
        </div>
        <p className="small muted">{left > 0 ? t('perDayLeft', { amt: yen(left / days), n: days }) : t('stretch')}</p>
        <form className="row mt" onSubmit={(e) => { e.preventDefault(); setSpendLog((l) => addSpend(l, amount, note)); setAmount(''); setNote(''); }}>
          <input className="input" style={{ width: 110 }} inputMode="numeric" placeholder="¥" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} aria-label={t('amountSpent')} />
          <input className="input grow" placeholder={t('noteOpt')} value={note} onChange={(e) => setNote(e.target.value)} aria-label={t('noteOpt')} />
          <button className="btn primary" type="submit" disabled={!amount}>{t('log')}</button>
        </form>
        {thisWeek.length > 0 && (
          <div className="stack mt" style={{ gap: 4 }}>
            {thisWeek.map((e) => (
              <div key={e.id} className="row small">
                <span className="faint" style={{ width: 70 }}>{new Date(e.at).toLocaleDateString(t('locale'), { weekday: 'short', day: 'numeric' })}</span>
                <span className="grow">{e.note || t('groceries')}</span>
                <span className="mono">{yen(e.amount)}</span>
                <button className="remove" onClick={() => setSpendLog((l) => l.filter((x) => x.id !== e.id))} aria-label={t('deleteEntry')}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <p className="eyebrow">{t('weeklyBudget')}</p>
        <Stepper label={t('weeklyBudget')} value={settings.weeklyBudget} options={BUDGET_STEPS} onChange={(v) => set({ weeklyBudget: v })} format={yen} />
        <p className="small muted center mt">{t('budgetBreakdown', { day: yen(settings.weeklyBudget / 7), meal: yen(settings.weeklyBudget / 21), month: yen((settings.weeklyBudget * 52) / 12) })}</p>
      </div>

      <div className="card">
        <p className="eyebrow">{t('dailyCalories')}</p>
        <Stepper label={t('dailyCalories')} value={settings.calorieGoal} options={CALORIE_STEPS} onChange={(v) => set({ calorieGoal: v })} format={(v) => `${v} kcal`} />
      </div>

      <div className="card">
        <p className="eyebrow">{t('diet')}</p>
        <div className="grid-2">
          {DIET_PROFILES.map((d) => (
            <button key={d.id} className="option" aria-pressed={settings.diet === d.id} onClick={() => set({ diet: d.id })}>
              <span className="emo" aria-hidden="true">{d.emoji}</span>
              <span><b>{tg(d.label)}</b><small>{tg(d.desc)}</small></span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="eyebrow">{t('allergies')}</p>
        <p className="small muted mb">{t('allergyIntro')}</p>
        <div className="row wrap">
          {ALLERGENS.map((a) => (
            <button key={a.cat} className="chip bad" aria-pressed={settings.allergies.includes(a.cat)} onClick={() => toggleAllergy(a.cat)}>
              {tg(a.label)}{tg(a.label) !== a.ja && <small className="ja">{a.ja}</small>}
            </button>
          ))}
          {customAllergies.map((a) => (
            <button key={a} className="chip bad" aria-pressed="true" onClick={() => toggleAllergy(a)}>{a} <X size={12} /></button>
          ))}
        </div>
        <form className="row mt" onSubmit={(e) => { e.preventDefault(); const t = custom.trim().slice(0, 40); if (t && !settings.allergies.includes(t)) set({ allergies: [...settings.allergies, t] }); setCustom(''); }}>
          <input className="input grow" placeholder={t('otherAllergy')} value={custom} onChange={(e) => setCustom(e.target.value)} aria-label={t('otherAllergy')} />
          <button className="btn" type="submit">{t('add')}</button>
        </form>
      </div>
    </div>
  );
}
