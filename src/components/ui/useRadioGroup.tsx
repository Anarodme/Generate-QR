'use client';

import { useState } from 'react';

export function useRadioGroup() {
    const [value, setValue] = useState<'image' | 'pdf'>('image');
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value as 'image' | 'pdf');
    };
  
    return { value, handleChange };
  }