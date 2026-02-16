import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

/**
 * Format duration in days to human-readable string
 */
export function formatDuration(days: number): string {
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days === 7) return '1 week';
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) return `${weeks} weeks`;
    return `${weeks} week${weeks > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${months} month${months > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert complexity score to level
 */
export function getComplexityLevel(score: number): 'low' | 'moderate' | 'high' {
  if (score < 33) return 'low';
  if (score < 66) return 'moderate';
  return 'high';
}

/**
 * Get complexity color class
 */
export function getComplexityColor(level: string): string {
  switch (level) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'moderate': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Get risk color class
 */
export function getRiskColor(level: string): string {
  switch (level) {
    case 'high': return 'text-red-600 bg-red-100 border-red-300';
    case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    case 'low': return 'text-green-600 bg-green-100 border-green-300';
    default: return 'text-gray-600 bg-gray-100 border-gray-300';
  }
}

/**
 * Calculate estimated reading time
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Format time of day array to readable string
 */
export function formatTimeOfDay(times: string[]): string {
  if (times.length === 0) return 'Anytime';
  if (times.length === 1) return capitalize(times[0]);
  if (times.length === 2) return times.map(capitalize).join(' and ');
  const last = times[times.length - 1];
  const rest = times.slice(0, -1);
  return rest.map(capitalize).join(', ') + ', and ' + capitalize(last);
}

/**
 * Parse frequency string to number per day
 */
export function parseFrequency(frequency: string): number {
  const lower = frequency.toLowerCase();
  if (lower.includes('once') || lower.includes('daily')) return 1;
  if (lower.includes('twice')) return 2;
  if (lower.includes('three times')) return 3;
  if (lower.includes('four times')) return 4;
  if (lower.includes('weekly')) return 1/7;
  if (lower.includes('monthly')) return 1/30;
  return 1;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Create URL with query parameters
 */
export function createUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}