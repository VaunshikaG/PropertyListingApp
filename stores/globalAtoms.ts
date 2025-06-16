// stores/globalAtoms.ts
// Jotai atoms for simpler, derived, or component-local state.
// Here we'll use it for the search input value.

import { atom } from 'jotai';

// Atom for the search input text
export const searchTermAtom = atom<string>('');