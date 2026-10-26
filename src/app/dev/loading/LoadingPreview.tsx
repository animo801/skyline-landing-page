'use client';

import { useState } from 'react';
import LoadingStep from '@/components/quote/LoadingStep';

const MESSAGE_SETS = {
  'Instant estimate': [
    'Measuring your roofline…',
    'Placing your lights…',
    'Calculating your estimate…',
  ],
  'Standard quote': [
    'Sending your info…',
    'Lining up your lights…',
    'Almost there…',
  ],
};

export default function LoadingPreview() {
  const [run, setRun] = useState(0);
  const [set, setSet] = useState<keyof typeof MESSAGE_SETS>('Instant estimate');
  const [model, setModel] = useState<'single' | 'two'>('two');

  return (
    <main className='mx-auto min-h-screen w-full max-w-md bg-white px-6 pt-6'>
      <div className='flex flex-wrap items-center gap-2'>
        {(Object.keys(MESSAGE_SETS) as (keyof typeof MESSAGE_SETS)[]).map(
          (name) => (
            <button
              key={name}
              type='button'
              onClick={() => {
                setSet(name);
                setRun((r) => r + 1);
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                set === name
                  ? 'bg-black text-white'
                  : 'bg-black/5 text-black/70'
              }`}
            >
              {name}
            </button>
          ),
        )}
        {(['single', 'two'] as const).map((m) => (
          <button
            key={m}
            type='button'
            onClick={() => {
              setModel(m);
              setRun((r) => r + 1);
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              model === m ? 'bg-black text-white' : 'bg-black/5 text-black/70'
            }`}
          >
            {m === 'single' ? 'Single-story' : 'Two-story'}
          </button>
        ))}
        <button
          type='button'
          onClick={() => setRun((r) => r + 1)}
          className='ml-auto rounded-full bg-skyline-blue px-4 py-1.5 text-sm font-bold text-white'
        >
          Replay
        </button>
      </div>
      <LoadingStep key={run} messages={MESSAGE_SETS[set]} model={model} />
    </main>
  );
}
