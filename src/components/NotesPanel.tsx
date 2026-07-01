'use client';

import { useEffect, useRef, useState } from 'react';
import { Panel } from '@/app/crea/ui';

/**
 * A persistent notepad. `initial` is the stored value (kept fresh by polling);
 * edits autosave on blur (and via the Save button). A dirty flag stops incoming
 * poll updates from clobbering in-progress typing.
 */
export function NotesPanel({
  title = 'Note',
  initial,
  save,
  placeholder = 'Appunti, indizi, nomi da ricordare…',
}: {
  title?: string;
  initial: string;
  save: (text: string) => Promise<unknown>;
  placeholder?: string;
}) {
  const [text, setText] = useState(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) setText(initial);
  }, [initial]);

  async function doSave() {
    setStatus('saving');
    try {
      await save(text);
      dirty.current = false;
      setStatus('saved');
      window.setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('idle');
    }
  }

  return (
    <Panel title={title}>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          dirty.current = true;
          setStatus('idle');
        }}
        onBlur={() => {
          if (dirty.current) doSave();
        }}
        placeholder={placeholder}
        className="min-h-72 w-full resize-y rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2 text-sm leading-relaxed text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs text-parchment-dim">
          {status === 'saving'
            ? 'Salvataggio…'
            : status === 'saved'
              ? 'Salvato ✓'
              : 'Si salva da solo quando esci dal campo.'}
        </span>
        <button
          type="button"
          onClick={doSave}
          disabled={status === 'saving'}
          className="rounded-md bg-gold px-3 py-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:brightness-110 disabled:opacity-50"
        >
          Salva
        </button>
      </div>
    </Panel>
  );
}
