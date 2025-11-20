/**
 * Helper utilities for common test operations
 */

/**
 * Get today's date in a specific format
 * @param format - Date format (e.g., 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function getTodayDate(format: string = 'YYYY-MM-DD'): string {
  const today = new Date();
  return formatDate(today, format);
}

/**
 * Format a date to a specific format
 * @param date - Date object to format
 * @param format - Date format string
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Convert date string to Date object
 * @param dateString - Date string in format 'YYYY-MM-DD'
 * @returns Date object
 */
export function convertToDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Add days to current date
 * @param days - Number of days to add
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function addDays(days: number): string {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return formatDate(result);
}

/**
 * Subtract days from current date
 * @param days - Number of days to subtract
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function subtractDays(days: number): string {
  return addDays(-days);
}

/**
 * Get the difference between two dates in days
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in days
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * Check if a date is in the future
 * @param date - Date to check
 * @returns True if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date < new Date();
}

/**
 * Delay execution for specified milliseconds
 * @param ms - Milliseconds to wait
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param delayMs - Initial delay in milliseconds
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await delay(delayMs * attempt);
    }
  }
  throw new Error('Retry failed');
}

/**
 * Convert string to lowercase
 * @param str - String to convert
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

/**
 * Convert string to uppercase
 * @param str - String to convert
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 */
export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Trim whitespace from string
 * @param str - String to trim
 */
export function trimString(str: string): string {
  return str.trim();
}

/**
 * Check if string contains substring
 * @param str - Main string
 * @param substring - Substring to search
 * @param caseSensitive - Case sensitive search
 */
export function containsString(str: string, substring: string, caseSensitive: boolean = false): boolean {
  if (!caseSensitive) {
    return str.toLowerCase().includes(substring.toLowerCase());
  }
  return str.includes(substring);
}

/**
 * Generate random string of specified length
 * @param length - Length of random string
 * @param characters - Characters to use (default: alphanumeric)
 */
export function generateRandomString(
  length: number = 10,
  characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate random number between min and max
 * @param min - Minimum number
 * @param max - Maximum number
 */
export function generateRandomNumber(min: number = 1, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Wait for element with timeout
 * @param condition - Condition to check
 * @param timeout - Timeout in milliseconds
 * @param interval - Check interval in milliseconds
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await delay(interval);
  }
  return false;
}

/**
 * Parse JSON string safely
 * @param jsonString - JSON string to parse
 * @param defaultValue - Default value if parsing fails
 */
export function parseJSON<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Deep clone an object
 * @param obj - Object to clone
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 * @param obj - Object to check
 */
export function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Merge multiple objects
 * @param objects - Objects to merge
 */
export function mergeObjects<T extends Record<string, unknown>>(...objects: T[]): T {
  return Object.assign({}, ...objects);
}
