// Presentation metadata only. Profile, services, skills and works use their existing sources.
// Stable command keys can be reused by a future, progressively enhanced command dispatcher.
export const shellCommands = [
  { id: 'whoami', command: 'whoami', label: 'Profile' },
  { id: 'services', command: 'ls services/', label: 'Services' },
  { id: 'about', command: 'cat about.txt', label: 'About' },
  { id: 'skills', command: 'cat skills.txt', label: 'Technologies' },
  { id: 'works', command: 'ls works/', label: 'Works' },
  { id: 'contact', command: 'contact', label: 'Contact' },
] as const;
