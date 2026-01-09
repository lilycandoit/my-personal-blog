/**
 * Sanitize text by replacing special unicode characters with standard ASCII equivalents
 * This prevents parsing errors from curly quotes, em dashes, etc.
 */
export function sanitizeText(text: string): string {
  if (!text) return text;

  return text
    // Replace curly single quotes with straight quotes
    .replace(/[\u2018\u2019]/g, "'")
    // Replace curly double quotes with straight quotes
    .replace(/[\u201C\u201D]/g, '"')
    // Replace em dash with regular dash
    .replace(/[\u2013\u2014]/g, '-')
    // Replace ellipsis character with three dots
    .replace(/\u2026/g, '...')
    // Replace non-breaking space with regular space
    .replace(/\u00A0/g, ' ');
}

/**
 * Sanitize all text fields in an object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeText(sanitized[key]) as any;
    }
  }

  return sanitized;
}
