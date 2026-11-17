import { useCallback, useState } from 'react';

const PREFIX = 'kc2_';

function read(key, init) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? init : JSON.parse(raw);
  } catch {
    return init;
  }
}

/** useState that survives reloads (localStorage, per device). */
export function usePersist(key, init) {
  const [value, setValue] = useState(() => read(key, init));
  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? next(prev) : next;
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(v));
        } catch {
          /* storage full or blocked: keep in memory */
        }
        return v;
      });
    },
    [key],
  );
  return [value, set];
}
