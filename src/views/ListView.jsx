import { useState } from 'react';
import { Check, Plus, ShoppingBasket, Trash2 } from 'lucide-react';
import { addManualItem, listTotals } from '../lib/shopping.js';
import { formatAmount, yen } from '../lib/recipe.js';
import { useI18n } from '../i18n/index.jsx';

export default function ListView({ list, setList, onFinish }) {
  const { t, lang } = useI18n();
  const [name, setName] = useState('');
  const [bigJa, setBigJa] = useState(false);
  const { total, inBasket, remaining } = listTotals(list);
  const checked = list.filter((i) => i.checked);

  const toggle = (key) => setList((l) => l.map((i) => (i.key === key ? { ...i, checked: !i.checked } : i)));
  const remove = (key) => setList((l) => l.filter((i) => i.key !== key));
  const add = (e) => {
    e.preventDefault();
    setList((l) => addManualItem(l, name));
    setName('');
  };

  return (
    <>
      <div className="section-head row">
        <div className="grow">
          <h2>{t('shoppingList')}</h2>
          <p>{list.length ? t('listSummary', { n: list.length, total: yen(total) }) : t('listEmptyHint')}</p>
        </div>
        {list.length > 0 && (
          <button className="chip" aria-pressed={bigJa} onClick={() => setBigJa((v) => !v)} title={t('jaMode')} aria-label={t('jaMode')}>
            日本語
          </button>
        )}
      </div>

      {list.length > 0 && (
        <div className="totals mb">
          <div className="stat"><b>{yen(total)}</b><small>{t('estimate')}</small></div>
          <div className="stat"><b style={{ color: 'var(--good)' }}>{yen(inBasket)}</b><small>{t('inBasket')}</small></div>
          <div className="stat"><b>{yen(remaining)}</b><small>{t('toGet')}</small></div>
        </div>
      )}

      <form className="row mb" onSubmit={add}>
        <input className="input grow" placeholder={t('addItem')} value={name} onChange={(e) => setName(e.target.value)} aria-label={t('addItem')} />
        <button className="icon-btn" type="submit" aria-label={t('add')}><Plus size={18} /></button>
      </form>

      {list.length === 0 ? (
        <div className="empty card">
          <div className="big"><ShoppingBasket size={40} /></div>
          <h3>{t('listEmpty')}</h3>
          <p className="small">{t('listEmptyBody')}</p>
        </div>
      ) : (
        <div className="stack" style={{ gap: 6 }}>
          {list.map((i) => (
            <div key={i.key} className={`list-item ${i.checked ? 'done' : ''}`}>
              <button className={`tick ${i.checked ? 'on' : ''}`} onClick={() => toggle(i.key)} aria-pressed={i.checked} aria-label={`${t('got')} ${i.label || i.en}`}>
                {i.checked && <Check size={14} />}
              </button>
              <div className="grow" onClick={() => toggle(i.key)} style={{ cursor: 'pointer' }}>
                {bigJa && i.ja ? (
                  <>
                    <p className="ja-big ja" style={{ fontSize: 22 }}>{i.ja}</p>
                    <p className="small faint">{i.label || i.en}</p>
                  </>
                ) : (
                  <>
                    <p className="name" style={{ fontWeight: 600 }}>{i.label || i.en} {i.ja && lang !== 'ja' && <span className="ja faint small">{i.ja}</span>}</p>
                    <p className="small faint">
                      {i.manual ? t('addedByYou') : formatAmount(i.amount, i.unit, lang)}
                      {i.from?.length ? ` · ${i.from.join(', ')}` : ''}
                    </p>
                  </>
                )}
              </div>
              <span className="mono small">{i.price ? yen(i.price) : ''}</span>
              <button className="remove" onClick={() => remove(i.key)} aria-label={`${t('remove')} ${i.label || i.en}`}><Trash2 size={16} /></button>
            </div>
          ))}

          <FinishBox checked={checked} estimate={inBasket} onFinish={(paid) => { onFinish(paid); setList((l) => l.filter((i) => !i.checked)); }} />
          <button className="btn ghost sm" onClick={() => setList([])}>{t('clearList')}</button>
        </div>
      )}
    </>
  );
}

function FinishBox({ checked, estimate, onFinish }) {
  const { t } = useI18n();
  const [paid, setPaid] = useState('');
  if (!checked.length) return null;
  return (
    <div className="card mt">
      <p className="eyebrow">{t('doneShopping')}</p>
      <p className="small muted">{t('doneBody', { est: yen(estimate), n: checked.length })}</p>
      <div className="row mt">
        <input className="input grow" inputMode="numeric" placeholder={String(Math.round(estimate))} value={paid} onChange={(e) => setPaid(e.target.value.replace(/[^\d]/g, ''))} aria-label={t('amountPaid')} />
        <button className="btn primary" onClick={() => onFinish(Number(paid) || Math.round(estimate))}>{t('logYen')}</button>
      </div>
    </div>
  );
}
