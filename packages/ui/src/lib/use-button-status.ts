import { DONE_FOR } from '@lib/loading';
import type { ButtonProps } from '@ui/types';
import { useEffect, useState } from 'react';

/** What a Button shows: `done` lasts DONE_FOR, then it's idle until `status` changes again. */
export const useButtonStatus = (status: ButtonProps['status']) => {
  const [flash, setFlash] = useState(status === 'done');

  useEffect(() => {
    if (status !== 'done') {
      setFlash(false);
      return;
    }
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), DONE_FOR);
    return () => clearTimeout(timer);
  }, [status]);

  if (status === 'pending') return 'pending';
  return status === 'done' && flash ? 'done' : 'idle';
};
