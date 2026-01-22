import { DEFAULT_TIMEZONE, DEFAULT_LOCATION } from './config';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

/**
 * Format a date with timezone and location for historical accuracy
 * @param date - Date to format
 * @param timezone - IANA timezone (e.g., 'Australia/Sydney')
 * @param location - Display location name (e.g., 'Sydney')
 * @param options - 'full' includes time + location, 'date' is date + location, 'month-year' is just month/year (no location)
 * @returns Formatted date string like "Jan 22, 2026, 10:33 am, Sydney"
 */
export function formatDate(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
  location: string = DEFAULT_LOCATION,
  options: 'full' | 'date' | 'month-year' = 'date'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (options === 'month-year') {
    // Month-year format with location (e.g., "Jan 2026, Sydney")
    const dateStr = new Intl.DateTimeFormat('en-AU', {
      month: 'short',
      year: 'numeric',
      timeZone: timezone,
    }).format(d);
    return `${dateStr}, ${location}`;
  }

  if (options === 'full') {
    // Full format: "Jan 22, 2026, 10:33 am, Sydney"
    const dateTime = new Intl.DateTimeFormat('en-AU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(d);
    return `${dateTime}, ${location}`;
  }

  // Default: date + location "Jan 22, 2026, Sydney"
  const dateStr = new Intl.DateTimeFormat('en-AU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  }).format(d);
  return `${dateStr}, ${location}`;
}

// Legacy function for backwards compatibility during migration
export function formatDateSydney(
  date: Date | string,
  options: 'full' | 'date' | 'month-year' = 'date'
): string {
  return formatDate(date, DEFAULT_TIMEZONE, DEFAULT_LOCATION, options);
}
