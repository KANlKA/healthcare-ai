import { createHash } from 'crypto';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  hits: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Generate cache key from input
   */
  generateKey(...parts: (string | number | boolean)[]): string {
    const input = parts.join('::');
    return createHash('sha256').update(input).digest('hex');
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expiresAt, hits: 0 });
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    entry.hits++;

    return entry.data as T;
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  stats() {
    let totalHits = 0;
    let expiredCount = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        expiredCount++;
      }
      totalHits += entry.hits;
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalHits,
      expiredCount,
      utilizationPercent: (this.cache.size / this.maxSize) * 100
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Create singleton instance
export const memoryCache = new MemoryCache(1000);

// Cache decorator for functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttlSeconds: number = 3600
): T {
  return (async (...args: Parameters<T>) => {
    const key = memoryCache.generateKey(fn.name, ...args);
    
    const cached = memoryCache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    memoryCache.set(key, result, ttlSeconds);
    
    return result;
  }) as T;
}

// Export for direct usage
export default memoryCache;