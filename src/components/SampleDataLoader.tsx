'use client';

import { useEffect, useState } from 'react';
import { loadSampleData } from '@/data/sampleData';

export function SampleDataLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Carregar dados de exemplo apenas no cliente
    if (typeof window !== 'undefined' && !loaded) {
      const timer = setTimeout(() => {
        loadSampleData();
        setLoaded(true);
      }, 100); // Pequeno delay para garantir que os hooks estão prontos

      return () => clearTimeout(timer);
    }
  }, [loaded]);

  // Força carregamento se não há dados após 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const parties = localStorage.getItem('maplePartyListings');
        if (!parties || JSON.parse(parties).length === 0) {
          console.log('Forçando carregamento de dados de exemplo...');
          loadSampleData();
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null; // Este componente não renderiza nada
}

