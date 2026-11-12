'use client';

import { useEffect, useState } from 'react';

const useSkeletonTimeout = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(timeout);
  }, []);
  return show;
};

export default useSkeletonTimeout;
