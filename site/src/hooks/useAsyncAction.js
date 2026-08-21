import { useState } from 'react';

// Enveloppe les appels à l'API depuis l'administration : sans cela, un échec
// réseau ou une validation refusée par le serveur passait inaperçu (la modale
// se fermait comme si l'enregistrement avait réussi).
export function useAsyncAction() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { error, setError, busy, run };
}
