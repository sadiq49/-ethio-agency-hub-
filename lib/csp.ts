export function getCSP() {
  const csp = [
    { name: 'default-src', values: ["'self'"] },
    { name: 'script-src', values: ["'self'", "'unsafe-inline'", "https://js.stripe.com"] },
    { name: 'style-src', values: ["'self'", "'unsafe-inline'"] },
    { name: 'img-src', values: ["'self'", 'data:', 'https://avatars.githubusercontent.com'] },
    { name: 'font-src', values: ["'self'", 'data:'] },
    { name: 'connect-src', values: ["'self'", 'https://*.supabase.co'] },
    { name: 'frame-src', values: ["'self'", 'https://js.stripe.com'] },
  ];

  return csp
    .map(directive => {
      return `${directive.name} ${directive.values.join(' ')}`;
    })
    .join('; ');
}