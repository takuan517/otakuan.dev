import contact from './functions/api/contact.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return contact.fetch(request, env);
    return env.ASSETS.fetch(request);
  },
};
